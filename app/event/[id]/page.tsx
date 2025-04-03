"use client"

import React from 'react';
import {SignInButton, useUser} from "@clerk/nextjs";
import {useParams, useRouter} from "next/navigation";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import Spinner from "@/components/Spinner";
import EventCard from "@/components/EventCard";
import {CalendarPlus, Info} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import JoinQueue from "@/components/JoinQueue";

const EventPage = () => {
    const {user} = useUser();
    const router = useRouter();
    const params = useParams();
    const event = useQuery(api.events.getById, {
        eventId: params.id as Id<"events">
    });

    const availability = useQuery(api.events.getEventAvailability, {
        eventId: params.id as Id<"events">
    })

    if (!user || !event || !availability) {
        return (
            <Spinner/>
        );
    }

    const isPastEvent = event.eventDate < Date.now();

    const isEventOwner = user.id === event?.userId;


    return (

        <div className="flex flex-col space-y-4 p-8">
            <EventCard key={event._id} eventId={event._id}/>
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                <Card className="flex-1">
                    <CardContent className="flex items-center space-x-4 pt-4">
                        <div className="flex flex-col space-y-4">
                            <div className="text-xl lg:text-2xl xl:text-3xl font-medium">Event information</div>
                            <div className="text-gray-400">
                                <div className="flex items-center space-x-2">
                                    <Info width={20} height={20}/>
                                    <p>Please arrive 30 min before the event starts.</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Info width={20} height={20}/>
                                    <p>Tickets are non-refundable.</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Info width={20} height={20}/>
                                    <p>Age restriction: 18+</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {user ? (
                    <Card
                        className={`flex-1 ${availability.purchasedCount >= availability.totalTickets ? "opacity-65" : ""}`}>
                        <CardContent className="flex items-center space-x-4 pt-4">
                            <div className="flex flex-1 flex-col space-y-4">
                                <div className="text-xl lg:text-2xl xl:text-3xl font-medium">Ticket availability</div>
                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center space-x-2">
                                        <div>
                                            💥
                                        </div>
                                        <div>
                                            <p>Sales start</p>
                                            <p className="text-sm text-gray-400">{new Date(event.salesStart).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div>💥</div>
                                        <div>
                                            <p>Sales end</p>
                                            <p className="text-sm text-gray-400">{new Date(event.salesEnd).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                                {!isPastEvent && isEventOwner && (
                                    <div
                                        className="flex flex-col lg:flex-row space-x-0 lg:space-x-2 space-y-4 lg:space-y-0">
                                        <Button className="w-full rounded-full"
                                                onClick={() => router.push(`/event/${event._id}/edit`)}>
                                            <CalendarPlus width={20} height={20}/>
                                            Edit Event
                                        </Button>
                                    </div>
                                )}

                                <div
                                    className="flex flex-col lg:flex-row space-x-0 lg:space-x-2 space-y-4 lg:space-y-0">
                                    <JoinQueue
                                        eventId={event._id}
                                        userId={user.id}
                                    />
                                </div>

                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <SignInButton>
                        <Button className="w-full rounded-full">Buy ticket</Button>
                    </SignInButton>
                )}
            </div>
        </div>
    );
};

export default EventPage;