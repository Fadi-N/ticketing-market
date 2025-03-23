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
import PurchaseTicket from "@/components/PurchaseTicket";
import {Badge} from "@/components/ui/badge";


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
                <Button className="w-full" variant="secondary"
                        onClick={() => router.push(`/tickets/${userTicket._id}`)}>
                    <TicketCheck width={20} height={20}/>
                    Peek at Your Golden Ticket!
                </Button>
            )
        }

        if (queuePosition) {
            return (
                <>
                    {queuePosition.status === "offered" && (
                        <PurchaseTicket eventId={eventId}/>
                    )}
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
        <Card
            className="flex flex-col justify-between hover:cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            onClick={() => router.push(`/event/${event._id}`)}
        >
            <CardContent className="flex flex-col h-full justify-between pt-4">
                <div className="flex flex-col space-y-4 mb-12">
                    <div className="text-xl lg:text-2xl xl:text-3xl font-medium">{event.name}</div>
                    <div>
                        <Badge className="rounded-full bg-orange-500">{event.category}</Badge>
                    </div>
                    <div className="text-base lg:text-lg xl:text-xl text-gray-400">{event.description}</div>
                </div>
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                        <div>🗓</div>
                        <p>
                            {new Date(event.eventDate).toLocaleDateString()}
                            {" "}
                            {isPastEvent && "(Ended)"}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div>📍</div>
                        <p>{event.location}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div>🎟️</div>
                        <p>
                            {availability.totalTickets - availability.purchasedCount} /{""} {availability.totalTickets} available
                        </p>
                    </div>
                </div>

                {!isPastEvent && renderTicketStatus()}
            </CardContent>
        </Card>
    );
};

export default EventCard;