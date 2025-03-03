"use client"

import React from 'react';
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import Spinner from "@/components/Spinner";
import EventCard from "@/components/EventCard";


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
            {upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {upcomingEvents.map((event) => (
                            <EventCard key={event._id} eventId={event._id}/>
                    ))}
                </div>
            ) : (
                <div>
                    <p>No upcoming events</p>
                    <p>Check back later for new events</p>
                </div>
            )}

        </div>
    );
};

export default EventList;