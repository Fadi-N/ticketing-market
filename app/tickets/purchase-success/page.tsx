import React from 'react';
import {Card, CardHeader} from "@/components/ui/card";
import {CircleCheck} from "lucide-react";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {getConvexClient} from "@/lib/convex";
import {api} from "@/convex/_generated/api";
import Ticket from "@/components/Ticket";

const PurchaseSuccessPage = async () => {
    const {userId} = await auth();
    if (!userId) {
        redirect("/");
    }

    const convex = getConvexClient();
    const tickets = await convex.query(api.events.getUserTickets, {userId});
    const latestTicket = tickets[tickets.length - 1];

    if (!latestTicket) {
        redirect("/");
    }

    return (
        <div className="p-8 flex flex-col space-y-4">
            <Card className="bg-green-100 text-green-500">
                <CardHeader className="flex flex-col items-center justify-center space-y-2">
                    <div className="flex items-center min-h-[200px]">
                        <CircleCheck width={60} height={60}/>
                    </div>
                    <div className="text-xl lg:text-2xl xl:text-3xl font-medium">
                        Ticket Purchase Successful!
                    </div>
                    <div className="text-base lg:text-lg xl:text-xl">
                        Your ticket has been successfully purchased.
                    </div>
                </CardHeader>
            </Card>

            <Ticket ticketId={latestTicket._id}/>
        </div>
    );
};

export default PurchaseSuccessPage;