'use client'

import React, {useEffect} from 'react';
import {useRouter} from "next/navigation";
import {useUser} from "@clerk/nextjs";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {Button} from "@/components/ui/button";
import ReleaseTicket from "@/components/ReleaseTicket";
import {createStripeCheckoutSession} from "@/app/actions/CreateStripeCheckoutSession";

interface PurchaeTicketProps {
    eventId: Id<"events">
}

const PurchaseTicket = ({eventId}: PurchaeTicketProps) => {
    const router = useRouter();
    const {user} = useUser();

    const queuePosition = useQuery(api.waitingList.getQueuePosition, {eventId, userId: user?.id ?? ""})

    const [timeRemaining, setTimeRemaining] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const offerExpiredAt = queuePosition?.offerExpiredAt ?? 0;

    const isExpired = Date.now() > offerExpiredAt;

    useEffect(() => {
        const calculateTimeRemaining = () => {
            if (isExpired) {
                setTimeRemaining("Expired");
                return;
            }

            const diff = offerExpiredAt - Date.now();
            const minutes = Math.floor(diff / 1000 / 60);
            const seconds = Math.floor((diff / 1000) % 60);

            if (minutes > 0) {
                setTimeRemaining(
                    `${minutes} minute${minutes === 1 ? "" : "s"} ${seconds} second${
                        seconds === 1 ? "" : "s"
                    }`
                );
            } else {
                setTimeRemaining(`${seconds} second${seconds === 1 ? "" : "s"}`);
            }
        }

        calculateTimeRemaining();
        const interval = setInterval(calculateTimeRemaining, 1000);
        return () => clearInterval(interval);
    }, [offerExpiredAt, isExpired]);

    const handlePurchase = async() => {
        if (!user) return;

        try {
            setIsLoading(true);
            const {sessionUrl} = await createStripeCheckoutSession({eventId});

            if (sessionUrl) {
                router.push(sessionUrl);
            }
        }catch (error) {
            console.error("Error creating checkout session:", error);
        }finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col space-y-4 p-4 border rounded-lg mt-4 bg-orange-100 text-orange-500">
            <div className="flex flex-col space-y-2">
                <div className="text-xl lg:text-2xl xl:text-3xl font-medium">Ticket reserved!</div>
                <div className="text-base lg:text-lg xl:text-xl">Expires in {timeRemaining}</div>
            </div>
            <p>
                A ticket has been reserved for you. Complete your purchase before the timer expires to secure your spot
                at this event.
            </p>
            <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-2 space-y-2 lg:space-y-0">
                <Button
                    className="w-full"
                    onClick={handlePurchase}
                    disabled={isExpired || isLoading}
                >
                    {isLoading
                        ? "Redirecting to checkout..."
                        : "Purchase Your Ticket Now"}
                </Button>
                <ReleaseTicket eventId={eventId} waitingListId={queuePosition._id}/>
            </div>
        </div>
    );
};

export default PurchaseTicket;