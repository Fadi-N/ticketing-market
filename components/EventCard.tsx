"use client"

import React from 'react';
import {Card, CardDescription, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Id} from "@/convex/_generated/dataModel";
import {useUser} from "@clerk/nextjs";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";


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
                <>
                    <p>You have a ticket</p>
                    <Button onClick={() => router.push(`/tickets/${userTicket._id}`)}>View your ticket</Button>
                </>
            )
        }

        if (queuePosition) {
            <>
                <p>PURCHASE BTN</p>
                {renderQueuePosition()}
                {queuePosition.status === "expired" && (
                    <>
                        <p>Offer expired</p>
                    </>
                )}
            </>
        }

        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{event.name}</CardTitle>
                <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div>
                    <p>
                        {new Date(event.eventDate).toLocaleDateString()}
                        {" "}
                        {isPastEvent && "(Ended)"}
                    </p>
                    <p>{event.location}</p>
                    <p>$ {event.price.toFixed(2)}</p>
                </div>
                <div>
                    <p>
                        {availability.totalTickets - availability.purchasedCount} /{""} {availability.totalTickets} available
                    </p>
                </div>
                {!isPastEvent && renderTicketStatus()}
            </CardContent>
        </Card>
    );
};

export default EventCard;