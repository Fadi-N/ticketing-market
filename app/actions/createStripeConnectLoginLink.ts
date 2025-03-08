"use server"

import {stripe} from "@/lib/stripe";

export async function createStripeConnectLoginLink(stripeAccountId: string) {
    if (!stripeAccountId) {
        throw Error("No stripe account id found.");
    }

    try {
        const loginLink = await stripe.accounts.createLoginLink(stripeAccountId);

        return loginLink.url;
    }catch (error) {
        console.error("Error while cretaing Stripe Connect login link:", error);
        throw new Error("Failed to create Stripe Connect Login Link.");
    }
}