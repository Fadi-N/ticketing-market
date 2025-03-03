import {query} from "@/convex/_generated/server";
import {v} from "convex/values";
import {WAITING_LIST_STATUS} from "@/convex/constants";

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