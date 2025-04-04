import React from 'react';
import {CircleCheck} from "lucide-react";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {getConvexClient} from "@/lib/convex";
import {api} from "@/convex/_generated/api";
import Ticket from "@/components/Ticket";
import AnnouncementCard from "@/components/AnnouncementCard";

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
            <AnnouncementCard
                icon={<CircleCheck className="w-12 h-12 lg:w-20 lg:h-20"/>}
                title="Ticket Purchase Successful!"
                description="Your ticket has been successfully purchased."
                customClass="bg-green-100 text-green-500"
            />

            <Ticket ticketId={latestTicket._id}/>
        </div>
    );
};

export default PurchaseSuccessPage;