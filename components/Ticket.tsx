'use client'

import React from 'react';
import {Id} from "@/convex/_generated/dataModel";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Info} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import Spinner from "@/components/Spinner";
import QRCode from "react-qr-code";

interface TicketProps {
    ticketId: Id<"tickets">;
}

const Ticket = ({ticketId}: TicketProps) => {
    const ticket = useQuery(api.tickets.getTicketWithDetails, {ticketId});
    const user = useQuery(api.users.getUserById, {userId: ticket?.userId ?? ""});

    if (!ticket || !ticket.event || !user) {
        return <Spinner/>;
    }

    return (
        <Card className="flex-1">
            <CardContent className="flex flex-col space-y-10 pt-4">
                <div>
                    <div className="flex flex-col space-y-2 mb-12 border-b pb-4">
                        <div className="text-xl lg:text-2xl xl:text-3xl font-medium">{ticket.event.name}</div>
                        <div>
                            <Badge className="rounded-full bg-orange-500">{ticket.event.category}</Badge>
                        </div>
                        <div className="text-base lg:text-lg xl:text-xl text-gray-400">{ticket.event.description}</div>
                    </div>
                    <div className="flex border-b pb-8">
                        <div className="flex-1 flex flex-col space-y-2">
                            <div className="flex items-center space-x-2">
                                <div>🗓</div>
                                <div>
                                    <p>Date</p>
                                    <p className="text-sm text-gray-400">
                                        {new Date(ticket.event.eventDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div>📍</div>
                                <div>
                                    <p>Location</p>
                                    <p className="text-sm text-gray-400">{ticket.event.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div>👤</div>
                                <div>
                                    <p>Ticket holder</p>
                                    <p className="text-sm text-gray-400">{user.name}</p>
                                    <p className="text-sm text-gray-400">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div>🪪</div>
                                <div>
                                    <p>Ticket holder ID</p>
                                    <p className="text-sm text-gray-400">{user.userId}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div>💰</div>
                                <div>
                                    <p>Ticket price</p>
                                    <p className="text-sm text-gray-400">${ticket.event.price.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="border-s-2 flex-1 flex flex-col space-y-10 items-center justify-center">
                            <QRCode value={ticket._id} className="w-32 h-32"/>
                            <div className="flex flex-col items-center">
                                <p>Ticket ID</p>
                                <p className="text-sm text-gray-400">{ticket._id}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col space-y-4 border-b pb-8">
                    <div className="text-xl lg:text-2xl xl:text-3xl font-medium">Event information</div>
                    <div>
                        <div className="flex items-center space-x-2 text-gray-400">
                            <Info width={20} height={20}/>
                            <p>Please arrive 30 min before the event starts.</p>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-400">
                            <Info width={20} height={20}/>
                            <p>Tickets are non-refundable.</p>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-400">
                            <Info width={20} height={20}/>
                            <p>Age restriction: 18+</p>
                        </div>
                    </div>
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

export default Ticket;