import {mutation, query} from "@/convex/_generated/server";
import {v} from "convex/values"

export const getUserById = query({
    args: {userId: v.string()},
    handler: async (ctx, {userId}) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_user_id", (query) => query.eq("userId", userId))
            .first()

        return user
    }
})

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

export const getUsersStripeConnectId = query({
    args: {userId: v.string()},
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .filter((query) => query.eq(query.field("userId"), args.userId))
            .filter((query) => query.neq(query.field("stripeConnectId"), undefined))
            .first()

        return user?.stripeConnectId;
    }
})

export const updateOrCreateUserStripeConnectId = mutation({
    args: {userId: v.string(), stripeConnectId: v.string()},
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_user_id", (query) => query.eq("userId", args.userId))
            .first()

        if (!user) {
            throw Error("User not found");
        }

        await ctx.db.patch(user._id, {stripeConnectId: args.stripeConnectId})
    }
})

