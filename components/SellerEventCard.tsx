'use client'

import React from 'react';
import {Doc} from "@/convex/_generated/dataModel";
import {Metrics} from "@/convex/events";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {usePathname, useRouter} from "next/navigation";
import CancelEventButton from "@/components/CancelEventButton";
import {CalendarPlus} from "lucide-react";
import {Button} from "@/components/ui/button";

interface SellerEventCardProps {
    event: Doc<"events"> & { metrics: Metrics }
}

const SellerEventCard = ({event}: SellerEventCardProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const isPastEvent = event.eventDate < Date.now();

    return (
        <Card
            className={`flex flex-col justify-between transition duration-300 ease-in-out transform ${!pathname.includes("/event/") ? "hover:cursor-pointer hover:-translate-y-1 hover:shadow-lg" : ""}`}
        >
            <CardContent className="flex flex-col h-full justify-between pt-4">
                <div className="flex items-baseline justify-between mb-8 border-b pb-4">
                    <div className="flex flex-col space-y-2">
                        <div className="text-xl lg:text-2xl xl:text-3xl font-medium">{event.name}</div>
                        <div>
                            <Badge className="rounded-full bg-orange-500 font-medium">{event.category}</Badge>
                        </div>
                        <div className="text-base lg:text-lg xl:text-xl text-gray-400">{event.description}</div>
                    </div>
                </div>
                <div className={`flex flex-col space-y-2 pb-8 ${!isPastEvent ? "border-b" : ""}`}>
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
                </div>
            </CardContent>
            {!isPastEvent && (
                <CardFooter className="flex flex-col space-y-2 lg:space-x-2 lg:space-y-0 lg:flex-row">
                    <Button className="w-full rounded-full"
                            onClick={() => router.push(`/event/${event._id}/edit`)}>
                        <CalendarPlus width={20} height={20}/>
                        Edit Event
                    </Button>
                    <CancelEventButton eventId={event._id}/>
                </CardFooter>
            )}
        </Card>
    );
};

export default SellerEventCard;