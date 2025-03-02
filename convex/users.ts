import {mutation} from "@/convex/_generated/server";
import {v} from "convex/values"

export const updateUser = mutation({
    args: {
        userId: v.string(),
        name: v.string(),
        email: v.string()
    },
    handler: async (ctx, {userId, name, email}) => {
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_user_id", (query) => query.eq("userId", userId))
            .first()

        if (existingUser) {
            await ctx.db.patch(existingUser._id, {
                name,
                email,
            });

            return existingUser._id
        }

        const newUserId = await ctx.db.insert("users", {
            userId,
            name,
            email,
            role: "user",
            stripeConnectId: undefined
        })

        return newUserId;
    }
})