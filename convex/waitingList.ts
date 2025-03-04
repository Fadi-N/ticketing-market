import {internalMutation, mutation, query} from "@/convex/_generated/server";
import {v} from "convex/values";
import {DURATIONS, TICKET_STATUS, WAITING_LIST_STATUS} from "@/convex/constants";
import {internal} from "@/convex/_generated/api";

export const getQueuePosition = query({
    args: {eventId: v.id("events"), userId: v.string()},
    handler: async (ctx, {eventId, userId}) => {
        const entry = await ctx.db
            .query("waitingList")
            .withIndex("by_user_event", (query) => query.eq("userId", userId).eq("eventId", eventId))
            .filter((query) => query.neq(query.field("status"), WAITING_LIST_STATUS.EXPIRED))
            .first()

        if (!entry) return null;

        const peopleAhead = await ctx.db
            .query("waitingList")
            .withIndex("by_event_status", (query) => query.eq("eventId", eventId))
            .filter(query => query.and(
                query.lt(query.field("_creationTime"), entry._creationTime),
                query.or(
                    query.eq(query.field("status"), WAITING_LIST_STATUS.WAITING),
                    query.eq(query.field("status"), WAITING_LIST_STATUS.OFFERED),
                )
            ))
            .collect()
            .then(entries => entries.length)

        return {
            ...entry,
            position: peopleAhead + 1
        }
    }
})

export const processQueue = mutation({
    args: {eventId: v.id("events")},
    handler: async (ctx, {eventId}) => {
        const event = await ctx.db.get(eventId);
        if (!event) throw new Error("Event not found");

        const {availableSpots} = await ctx.db
            .query("events")
            .filter((query) => query.eq(query.field("_id"), eventId))
            .first()
            .then(async (event) => {
                if (!event) throw new Error("Event not found");

                const purchasedCount = await ctx.db
                    .query("tickets")
                    .withIndex("by_event", (query) => query.eq("eventId", eventId))
                    .collect()
                    .then((tickets) => tickets.filter(ticket => ticket.status === TICKET_STATUS.VALID || ticket.status === TICKET_STATUS.USED).length)

                const now = Date.now();
                const activeOffers = await ctx.db
                    .query("waitingList")
                    .withIndex("by_event_status", (query) => query.eq("eventId", eventId).eq("status", WAITING_LIST_STATUS.OFFERED))
                    .collect()
                    .then((entries) => entries.filter(entry => (entry.offerExpiredAt ?? 0) > now).length)

                return {
                    availableSpots: event.totalTickets - (purchasedCount + activeOffers),
                };
            })

        if (availableSpots <= 0) return;

        const waitingUsers = await ctx.db
            .query("waitingList")
            .withIndex("by_event_status", (q) =>
                q.eq("eventId", eventId).eq("status", WAITING_LIST_STATUS.WAITING)
            )
            .order("asc")
            .take(availableSpots);

        const now = Date.now();
        for (const user of waitingUsers) {
            await ctx.db.patch(user._id, {
                status: WAITING_LIST_STATUS.OFFERED,
                offerExpiredAt: now + DURATIONS.TICKET_OFFER,
            });

            await ctx.scheduler.runAfter(
                DURATIONS.TICKET_OFFER,
                internal.waitingList.expireOffer,
                {
                    waitingListId: user._id,
                    eventId,
                }
            );
        }
    }
})

export const expireOffer = internalMutation({
    args: {waitingListId: v.id("waitingList"), eventId: v.id("events")},
    handler: async (ctx, {waitingListId, eventId}) => {
        const offer = await ctx.db.get(waitingListId);

        if (!offer || offer.status !== WAITING_LIST_STATUS.OFFERED) return;

        await ctx.db.patch(waitingListId, {
            status: WAITING_LIST_STATUS.EXPIRED
        })

        await processQueue(ctx, {eventId});
    }
})

export const releaseTicket = mutation({
    args: {
        eventId: v.id("events"),
        waitingListId: v.id("waitingList"),
    },
    handler: async (ctx, { eventId, waitingListId }) => {
        const entry = await ctx.db.get(waitingListId);
        if (!entry || entry.status !== WAITING_LIST_STATUS.OFFERED) {
            throw new Error("No valid ticket offer found");
        }

        await ctx.db.patch(waitingListId, {
            status: WAITING_LIST_STATUS.EXPIRED,
        });

        await processQueue(ctx, { eventId });
    },
});