"use client"

import React from 'react';
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import Spinner from "@/components/Spinner";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


const EventList = () => {
    const events = useQuery(api.events.get);

    if (!events) {
        return (
            <Spinner/>
        )
    }

    const upcomingEvents = events
        .filter(event => event.eventDate > Date.now())
        .sort((a, b) => a.eventDate - b.eventDate)


    return (
        <div>
            <p>Upcoming Events</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {upcomingEvents.map((event) => (
                    <React.Fragment key={event._id}>
                        <Card>
                            <CardHeader>
                                <CardTitle>{event.name}</CardTitle>
                                <CardDescription>{event.description}</CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <div>
                                    <p>{event.eventDate}</p>
                                    <p>{event.location}</p>
                                    <p>{event.price} USD</p>
                                </div>
                            </CardFooter>
                        </Card>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default EventList;