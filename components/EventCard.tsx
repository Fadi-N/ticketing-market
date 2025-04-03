"use client"

import React from 'react';
import {Card, CardContent} from "@/components/ui/card";
import {Id} from "@/convex/_generated/dataModel";
import {useUser} from "@clerk/nextjs";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {usePathname, useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import PurchaseTicket from "@/components/PurchaseTicket";
import {Badge} from "@/components/ui/badge";
import {CircleCheck, Frown} from "lucide-react";
import AnnouncementCard from "@/components/AnnouncementCard";
import Spinner from "@/components/Spinner";


interface EventCardProps {
    eventId: Id<"events">
}

const EventCard = ({eventId}: EventCardProps) => {
    const {user} = useUser();
    const pathname = usePathname();
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

        if (availability.purchasedCount < availability.totalTickets) {
            return (
                <AnnouncementCard
                    icon={<Spinner variant="warning"/>}
                    title="Sold out! You&rsquo;re in the waiting queue for ticket availability."
                    description={`Queue position #${queuePosition.position}`}
                    customClass="bg-orange-100 text-orange-500"
                />
            )
        }
    }

    const renderTicketStatus = () => {
        if (!user) return null;

        if (queuePosition) {
            return (
                <>
                    {queuePosition.status === "offered" && (
                        <PurchaseTicket eventId={eventId}/>
                    )}
                    {renderQueuePosition()}
                    {queuePosition.status === "expired" && (
                        <AnnouncementCard
                            icon={<Frown className="w-12 h-12 lg:w-20 lg:h-20"/>}
                            title="Offer expired!"
                        />
                    )}
                </>
            )
        }

        return null;
    }

    const handleCardClick = () => {
        if (pathname.includes("/event/")) {
            return;
        }

        router.push(`/event/${event._id}`)
    }

    return (
        <Card
            className={`flex flex-col justify-between transition duration-300 ease-in-out transform ${!pathname.includes("/event/") ? "hover:cursor-pointer hover:-translate-y-1 hover:shadow-lg" : ""}`}
            onClick={handleCardClick}
        >
            <CardContent className="flex flex-col h-full justify-between pt-4">
                <div className="flex flex-col space-y-2 mb-6 border-b pb-4">
                    <div className="text-xl lg:text-2xl xl:text-3xl font-medium">{event.name}</div>
                    <div>
                        <Badge className="rounded-full bg-orange-500 font-medium">{event.category}</Badge>
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

                    {pathname.includes("/event/") && (
                        <div className="flex items-center space-x-2 justify-end py-4">
                            <Badge className="rounded-full text-lg font-medium lg:text-2xl">
                                ${event.price.toFixed(2)}
                            </Badge>
                        </div>
                    )}

                    {userTicket && (
                        <div
                            className="flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0 p-4 border rounded-lg bg-green-100 text-green-500">
                            <div className="flex items-center justify-center space-x-2">
                                <CircleCheck className="w-8 h-8"/>
                                <div className="text-xl lg:text-2xl xl:text-3xl font-medium">You have a ticket!</div>
                            </div>

                            <Button
                                className="w-full lg:w-auto rounded-full bg-green-500"
                                onClick={() => router.push(`/tickets/${userTicket._id}`)}
                            >
                                View your ticket
                            </Button>

                        </div>
                    )}
                </div>

                {!isPastEvent && renderTicketStatus()}
            </CardContent>
        </Card>
    )
        ;
};

export default EventCard;