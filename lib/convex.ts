import {ConvexClient} from "convex/browser";

export const getConvexClient = () => {
    if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
        throw new Error('Missing NEXT_PUBLIC_CONVEX_URL');
    }

    return new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL);
}