'use client'

import React, {useEffect} from 'react';
import Ticket from "@/components/Ticket";
import {redirect, useParams, useRouter} from "next/navigation";
import {useUser} from "@clerk/nextjs";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ArrowLeft, CalendarDays, CalendarPlus, Download, Share2} from "lucide-react";

const TicketPage = () => {
    const params = useParams();
    const router = useRouter();
    const {user} = useUser();
    const ticket  = useQuery(api.tickets.getTicketWithDetails, {ticketId: params.id as Id<"tickets">})

    useEffect(() => {
        if (!user){
            redirect("/")
        }

        if (!ticket || ticket.userId !== user.id) {
            redirect("/tickets");
        }

        if (!ticket.event) {
            redirect("/tickets");
        }
    }, [ticket, user]);

    if (!ticket || !ticket.event) {
        return null;
    }

    return (
        <div className="p-8 space-y-4">
            <div className="flex items-center justify-between">
                <Button
                    className="w-full lg:w-auto rounded-full"
                    onClick={() => router.push("/tickets")}
                >
                    <ArrowLeft width={20} height={20} />
                    back to my tickets
                </Button>

                <div className="flex space-x-2">
                    <Button className="w-full lg:w-auto rounded-full">
                        <Download width={20} height={20} />
                        Save
                    </Button>
                    <Button className="w-full lg:w-auto rounded-full">
                        <Share2 width={20} height={20} />
                        Share
                    </Button>
                </div>
            </div>
            <Ticket ticketId={ticket._id}/>
            <Card>
                <CardContent className="pt-4">
                    <div className="flex flex-col space-y-4">
                        <div className="text-xl lg:text-2xl xl:text-3xl font-medium">
                            Need Help?
                        </div>
                        <div className="text-base lg:text-lg xl:text-xl text-gray-400">
                            {ticket.event.is_cancelled
                                ? "For questions about refunds or cancellations, please contact our support team."
                                : "If you have any issues with your ticket, please contact our support team."}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TicketPage;