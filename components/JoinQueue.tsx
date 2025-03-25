'use client'

import React from 'react';
import {Id} from "@/convex/_generated/dataModel";
import {useMutation, useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import Spinner from "@/components/Spinner";
import {WAITING_LIST_STATUS} from "@/convex/constants";
import {Button} from "@/components/ui/button";
import {ConvexError} from "convex/values";
import {toast} from "sonner";
import {CalendarClock, Coins, Frown} from "lucide-react";
import AnnouncementCard from "@/components/AnnouncementCard";

interface JoinQueueProps {
    eventId: Id<"events">,
    userId: string
}

const JoinQueue = ({eventId, userId}: JoinQueueProps) => {
    const joinWaitingList = useMutation(api.events.joinWaitingList);

    const event = useQuery(api.events.getById, {eventId});
    const availability = useQuery(api.events.getEventAvailability, {eventId});
    const queuePosition = useQuery(api.waitingList.getQueuePosition, {
        userId,
        eventId
    });
    const userTicket = useQuery(api.tickets.getUserTicketForEvent, {
        eventId,
        userId
    })

    const handleJoinQueue = async () => {
        try {
            const result = await joinWaitingList({eventId, userId});
            if (result.success) {
                console.log("Successfully joined waiting list");
                toast.success("Success!", {
                    description: "Successfully joined the waiting list.",
                    duration: 5000,
                });
            }
        } catch (error) {
            if (
                error instanceof ConvexError &&
                error.message.includes("joined the waiting list too many times")
            ) {
                toast.error("Slow down there!", {
                    description: error.data,
                    duration: 5000,
                });
            } else {
                console.error("Error joining waiting list:", error);
                toast.error("Uh oh! Something went wrong.", {
                    description: "Failed to join queue. Please try again later.",
                    duration: 5000,
                });
            }
        }
    };
    if (queuePosition === undefined || availability === undefined || !event) {
        return <Spinner/>;
    }

    if (userTicket) {
        return null;
    }

    const isPastEvent = event.eventDate < Date.now();

    return (
        <>
            {(!queuePosition ||
                queuePosition.status === WAITING_LIST_STATUS.EXPIRED ||
                (queuePosition.status === WAITING_LIST_STATUS.OFFERED &&
                    queuePosition.offerExpiredAt &&
                    queuePosition.offerExpiredAt <= Date.now())) && (
                <>
                    {isPastEvent ? (
                            <AnnouncementCard
                                icon={<CalendarClock width={60} height={60}/>}
                                title="Event has ended"
                                customClass="bg-red-100 text-red-500 w-full"
                            />
                    ) : availability.purchasedCount >= availability?.totalTickets ? (
                            <AnnouncementCard
                                icon={<Frown width={60} height={60}/>}
                                title="Event is sold out"
                                customClass="bg-red-100 text-red-500 w-full"
                            />
                    ) : (
                        <Button
                            className="w-full rounded-full"
                            onClick={handleJoinQueue}
                            disabled={isPastEvent}
                        >
                            <Coins width={20} height={20}/>
                            Buy Ticket
                        </Button>
                    )}
                </>
            )}
        </>
    );
};

export default JoinQueue;