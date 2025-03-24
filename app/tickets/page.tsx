'use client'

import React from 'react';
import {useUser} from "@clerk/nextjs";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent} from "@/components/ui/card";
import {Info} from "lucide-react";
import TicketCard from "@/components/TicketCard";

const MyTicketsPage = () => {
    const {user} = useUser();
    const tickets = useQuery(api.events.getUserTickets, {userId: user?.id ?? ""});

    if (!tickets) return null;

    const validTickets = tickets.filter((ticket) => ticket.status === "valid");
    const otherTickets = tickets.filter((ticket) => ticket.status !== "valid");

    const upcomingTickets = validTickets.filter((ticket) => ticket.event && ticket.event.eventDate > Date.now());
    const pastTickets = validTickets.filter((ticket) => ticket.event && ticket.event.eventDate <= Date.now());

    return (
        <div className="p-8 flex flex-col space-y-4">
            <div className="flex justify-between items-center">
                <div className="text-3xl lg:text-4xl xl:text-5xl font-semibold">My tickets</div>
                <Badge className="rounded-full bg-orange-500">{tickets.length} total tickets</Badge>
            </div>

            {upcomingTickets.length > 0 && (
                <div>
                    <div className="text-xl lg:text-2xl xl:text-3xl font-medium">Upcoming events</div>
                    <div>
                        {upcomingTickets.map((ticket) => (
                            <TicketCard key={ticket._id} ticketId={ticket._id}/>
                        ))}
                    </div>
                </div>
            )}

            {pastTickets.length > 0 && (
                <div>
                    <div className="text-xl lg:text-2xl xl:text-3xl font-medium">Past events</div>
                    <div>
                        {pastTickets.map((ticket) => (
                            <TicketCard key={ticket._id} ticketId={ticket._id}/>
                        ))}
                    </div>
                </div>
            )}

            {otherTickets.length > 0 && (
                <div>
                    <div className="text-xl lg:text-2xl xl:text-3xl font-medium">Other tickets</div>
                    <div>
                        {otherTickets.map((ticket) => (
                            <TicketCard key={ticket._id} ticketId={ticket._id}/>
                        ))}
                    </div>
                </div>
            )}

            {tickets.length === 0 && (
                <Card>
                    <CardContent className="pt-4">

                        <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="flex items-center min-h-[200px]">
                                <Info width={60} height={60}/>
                            </div>
                            <div className="text-xl lg:text-2xl xl:text-3xl font-medium">No ticket yet</div>
                            <div className="text-base lg:text-lg xl:text-xl">
                                All you tickets will be listed here.
                            </div>
                        </div>

                    </CardContent>
                </Card>
            )}

        </div>
    );
};

export default MyTicketsPage;