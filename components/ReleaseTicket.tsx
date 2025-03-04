'use client'

import React from 'react';
import {Id} from "@/convex/_generated/dataModel";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";

interface PurchaseTicketProps {
    eventId: Id<"events">
    waitingListId: Id<"waitingList">
}

const ReleaseTicket = ({eventId, waitingListId}: PurchaseTicketProps) => {
    console.log("ReleaseTicket", eventId, waitingListId);


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
        <button
            onClick={handleRelease}
            disabled={isReleasing}
        >
            {isReleasing ? "Releasing..." : "Release Ticket Offer"}
        </button>
    );
};

export default ReleaseTicket;