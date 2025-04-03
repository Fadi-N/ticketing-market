'use client'

import React from 'react';
import EventForm from "@/components/EventForm";
import {useParams, useRouter} from "next/navigation";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";

const EditEventPage = () => {
    const params = useParams();
    const router = useRouter();
    const event = useQuery(api.events.getById, {eventId: params.id as Id<"events">});

    if (!event) {
        return null;
    }
    return (
        <div className="p-8 space-y-4">
            <div className="flex items-center justify-between">
                <Button
                    className="rounded-full"
                    onClick={() => router.push("/seller/events")}
                >
                    <ArrowLeft width={20} height={20}/>
                    Back to events
                </Button>
            </div>
            <EventForm mode="update" initialData={event}/>
        </div>
    );
};

export default EditEventPage;