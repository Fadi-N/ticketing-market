'use client'

import React from 'react';
import {Id} from "@/convex/_generated/dataModel";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Button} from "@/components/ui/button";

interface PurchaseTicketProps {
    eventId: Id<"events">
    waitingListId: Id<"waitingList">
}

const ReleaseTicket = ({eventId, waitingListId}: PurchaseTicketProps) => {
    const [isReleasing, setIsReleasing] = React.useState(false);
    const releaseTicket = useMutation(api.waitingList.releaseTicket);

    const handleRelease = async () => {
        if (!confirm("Are you sure you want to release your ticket offer?")) return;

        try {
            setIsReleasing(true);
            await releaseTicket({
                eventId,
                waitingListId,
            });
        } catch (error) {
            console.error("Error releasing ticket:", error);
        } finally {
            setIsReleasing(false);
        }

    }

    return (
        <Button
            className="w-full"
            onClick={handleRelease}
            disabled={isReleasing}
        >
            {isReleasing ? "Releasing..." : "Release Ticket Offer"}
        </Button>
    );
};

export default ReleaseTicket;