import {query} from "@/convex/_generated/server";
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