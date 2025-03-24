import React from 'react';
import {Id} from "@/convex/_generated/dataModel";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import Spinner from "@/components/Spinner";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {usePathname, useRouter} from "next/navigation";

interface TicketCardProps {
    ticketId: Id<"tickets">
}

const TicketCard = ({ticketId}: TicketCardProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const ticket = useQuery(api.tickets.getTicketWithDetails, {ticketId});
    if (!ticket || !ticket.event) {
        return <Spinner/>
    }

    const isPastEvent = ticket.event.eventDate < Date.now();


    return (
        <Card
            className={`flex flex-col justify-between transition duration-300 ease-in-out transform ${!pathname.includes("/event/") ? "hover:cursor-pointer hover:-translate-y-1 hover:shadow-lg" : ""}`}
        >
            <CardContent className="flex flex-col h-full justify-between pt-4">
                <div className="flex flex-col space-y-2 mb-12 border-b pb-4">
                    <div className="text-xl lg:text-2xl xl:text-3xl font-medium">{ticket.event.name}</div>
                    <div>
                        <Badge className="rounded-full bg-orange-500">{ticket.event.category}</Badge>
                    </div>
                </div>
                <div className="flex flex-col space-y-2 border-b pb-8">
                    <div className="flex items-center space-x-2">
                        <div>🗓</div>
                        <p>
                            {new Date(ticket.event.eventDate).toLocaleDateString()}
                            {" "}
                            {isPastEvent && "(Ended)"}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div>📍</div>
                        <p>{ticket.event.location}</p>
                    </div>
                    {/*
                    <Button
                        className="w-full lg:w-auto rounded-full bg-green-500"
                        onClick={() => router.push(`/tickets/${ticketId}`)}
                    >
                        View your ticket
                    </Button>*/}

                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <div>
                    <p>Purchase Date</p>
                    <p className="text-sm text-gray-400">
                        {new Date(ticket.purchasedAt).toLocaleString()}
                    </p>
                </div>
                <Badge
                    className={ticket.event.is_cancelled
                        ? "rounded-full bg-red-100 text-red-500"
                        : "rounded-full bg-green-100 text-green-500"}
                >                    {ticket.event.is_cancelled ? "Cancelled" : "Valid Ticket"}
                </Badge>
            </CardFooter>
        </Card>
    );
};

export default TicketCard;