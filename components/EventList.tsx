"use client"

import React from 'react';
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import Spinner from "@/components/Spinner";
import EventCard from "@/components/EventCard";
import {Frown} from "lucide-react";
import AnnouncementCard from "@/components/AnnouncementCard";


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

    const pastEvents = events
        .filter(event => event.eventDate <= Date.now())
        .sort((a, b) => b.eventDate - a.eventDate)

    return (
        <div className="p-8 flex flex-col gap-y-12">
            <div className="flex flex-col space-y-4">
                <div className="text-3xl lg:text-4xl xl:text-5xl font-semibold">Upcoming Events</div>
                {upcomingEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {upcomingEvents.map((event) => (
                            <EventCard key={event._id} eventId={event._id}/>
                        ))}
                    </div>
                ) : (
                    <AnnouncementCard
                        icon={<Frown width={60} height={60}/>}
                        title="Nothing cooking yet."
                        description="Come back later, we might surprise you with more than just tumbleweeds!"
                    />
                )}
            </div>
            <div className="flex flex-col space-y-4">
                {pastEvents.length > 0 && (
                    <>
                        <div className="text-3xl lg:text-4xl xl:text-5xl font-semibold">Past Events</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pastEvents.map((event) => (
                                <EventCard key={event._id} eventId={event._id}/>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default EventList;