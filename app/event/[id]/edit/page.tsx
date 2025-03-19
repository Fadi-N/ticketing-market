'use client'

import React from 'react';
import EventForm from "@/components/EventForm";
import {useParams} from "next/navigation";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

const EditEventPage = () => {
    const params = useParams();
    const event = useQuery(api.events.getById, {eventId: params.id as Id<"events">});

    if (!event) {
        return null;
    }
    return (
        <div className="p-8">
            <EventForm mode="update" initialData={event} />
        </div>
    );
};

export default EditEventPage;