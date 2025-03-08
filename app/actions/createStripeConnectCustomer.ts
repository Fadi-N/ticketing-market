"use server"

import {ConvexHttpClient} from "convex/browser";
import {auth} from "@clerk/nextjs/server";
import {api} from "@/convex/_generated/api";
import {stripe} from "@/lib/stripe";

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("No STRIPE_SECRET_KEY set yet");
}

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    throw new Error("No NEXT_PUBLIC_CONVEX_URL set yet");
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function createStripeConnectCustomer() {
    const {userId} = await auth();

    if (!userId) {
        throw new Error("User ID is required");
    }

    // Check if user already has a connect account
    const existingStripeConnectId = await convex.query(api.users.getUsersStripeConnectId, {userId});

    if (!existingStripeConnectId) {
        return {account: existingStripeConnectId};
    }

    // Create ne connect account
    const account = await stripe.accounts.create({
        type: "express", capabilities: {
            card_payments: {requested: true},
            transfers: {requested: true},
        }
    });

    // Update user with stripe connect id
    await convex.mutation(api.users.updateOrCreateUserStripeConnectId, {userId, stripeConnectId: account.id})

    return {account: account.id};
}