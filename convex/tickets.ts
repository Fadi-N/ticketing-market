import {mutation, query} from "@/convex/_generated/server";
import {v} from "convex/values";

export const getUserTicketForEvent = query({
    args: {eventId: v.id("events"), userId: v.string()},
    handler: async (ctx, {eventId, userId}) => {
        const ticket = await ctx.db
            .query("tickets")
            .withIndex("by_user_event", (query) => query.eq("userId", userId).eq("eventId", eventId))
            .first()

        return ticket;
    }
})

export const getTicketWithDetails = query({
    args: {ticketId: v.id("tickets")},
    handler: async (ctx, {ticketId}) => {
        const ticket = await ctx.db.get(ticketId);
        if (!ticketId) return null;

        const event = await ctx.db.get(ticket.eventId);

        return {
            ...ticket,
            event
        }
    }
})

export const getValidTicketsForEvent = query({
    args: {eventId: v.id("events")},
    handler: async (ctx, {eventId}) => {
        return await ctx.db
            .query("tickets")
            .withIndex("by_event", (query) => query.eq("eventId", eventId))
            .filter((query) =>
                query.or(query.eq(query.field("status"), "valid"), query.eq(query.field("status"), "used"))
            )
            .collect();
    }
})

export const updateTicketStatus = mutation({
    args: {
        ticketId: v.id("tickets"),
        status: v.union(
            v.literal("valid"),
            v.literal("used"),
            v.literal("refunded"),
            v.literal("cancelled")
        ),
    },
    handler: async (ctx, {ticketId, status}) => {
        await ctx.db.patch(ticketId, {status});
    },
})