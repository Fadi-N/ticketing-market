import React from 'react';
import {Doc} from "@/convex/_generated/dataModel";
import {Metrics} from "@/convex/events";

interface SellerEventCardProps {
    event: Doc<"events"> & {metrics: Metrics}
}

const SellerEventCard = ({event}: SellerEventCardProps) => {
    const isPastEvent = event.eventDate < Date.now();

    return (
        <div>

        </div>
    );
};

export default SellerEventCard;