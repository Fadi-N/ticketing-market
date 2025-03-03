"use client"

import React from 'react';
import {Card, CardDescription, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Id} from "@/convex/_generated/dataModel";
import {useUser} from "@clerk/nextjs";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {CalendarDays, MapPin, Ticket, TicketCheck} from "lucide-react";


interface EventCardProps {
    eventId: Id<"events">
}

const EventCard = ({eventId}: EventCardProps) => {
    const {user} = useUser();
    const router = useRouter();
    const event = useQuery(api.events.getById, {eventId});
    const availability = useQuery(api.events.getEventAvailability, {eventId});

    const userTicket = useQuery(api.tickets.getUserTicketForEvent, {eventId, userId: user?.id ?? ""});

    const queuePosition = useQuery(api.waitingList.getQueuePosition, {eventId, userId: user?.id ?? ""});

    if (!event || !availability) {
        return null;
    }

    const isPastEvent = event.eventDate < Date.now();

    const renderQueuePosition = () => {
        if (!queuePosition || queuePosition.status !== "waiting") return null;

        if (availability.purchasedCount >= availability.totalTickets) {
            return (
                <p>
                    SOLD OUT
                </p>
            )
        }

        return (
            <p>Queue position #{queuePosition.position}</p>
        )
    }

    const renderTicketStatus = () => {
        if (!user) return null;

        if (userTicket) {
            return (
                <Button className="w-full" variant="secondary" onClick={() => router.push(`/tickets/${userTicket._id}`)}>
                    <TicketCheck width={20} height={20}/>
                    Peek at Your Golden Ticket!
                </Button>
            )
        }

        if (queuePosition) {
            return (
                <>
                    <p>PURCHASE BTN</p>
                    {renderQueuePosition()}
                    {queuePosition.status === "expired" && (
                        <>
                            <p>Offer expired</p>
                        </>
                    )}
                </>
            )
        }

        return null;
    }

    return (
        <Card className="flex flex-col justify-between">
            <CardHeader className="md:min-h-44 lg:min-h-72">
                <h3>{event.name}</h3>
                <h5>{event.description}</h5>
            </CardHeader>
            <CardContent className="flex flex-col space-y-5 lg:space-y-10">
                <div
                    className="flex flex-col justify-between space-y-2 text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl md:min-h-24 lg:min-h-32">
                    <div className="flex items-center space-x-2">
                        <CalendarDays width={20} height={20}/>
                        <p>
                            {new Date(event.eventDate).toLocaleDateString()}
                            {" "}
                            {isPastEvent && "(Ended)"}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <MapPin width={20} height={20}/>
                        <p>{event.location}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Ticket width={20} height={20}/>
                        <p>
                            {availability.totalTickets - availability.purchasedCount} /{""} {availability.totalTickets} available
                        </p>
                    </div>
                </div>

                <h3>$ {event.price.toFixed(2)}</h3>
                {!isPastEvent && renderTicketStatus()}
            </CardContent>
        </Card>
    );
};

export default EventCard;