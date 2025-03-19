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

    if (!event || !availability) {
        return (
            <Spinner/>
        );
    }

    return (

        <div className="grid grid-cols-1 lg:grid-cols-2 p-8 gap-4">
            <div className="flex flex-col space-y-4">
                <EventCard key={event._id} eventId={event._id}/>
                <Card>
                    <CardContent className="flex items-center space-x-4 pt-4">
                        <Info width={40} height={40}/>
                        <div className="flex flex-col space-y-4">
                            <h5>Event information</h5>
                            <div>
                                <p>
                                    • Please arrive 30 min before the event starts.
                                </p>
                                <p>
                                    • Tickets are non-refundable.
                                </p>
                                <p>
                                    • Age restriction: 18+
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardContent>
                        {user ? (
                            <>
                                <JoinQueue
                                    eventId={event._id}
                                    userId={user.id}
                                />
                                <Button className="w-full"
                                        onClick={() => router.push(`/event/${event._id}/edit`)}>
                                    <CalendarPlus width={20} height={20}/>
                                    Edit Event
                                </Button>
                            </>

                        ) : (
                            <SignInButton>
                                <Button>Sign In or Tickets Stay Single!</Button>
                            </SignInButton>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EventPage;