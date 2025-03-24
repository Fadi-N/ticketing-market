import React from 'react';
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {CalendarPlus} from "lucide-react";
import SellerEventList from "@/components/SellerEventList";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";

const SellerEventsPage = async () => {
    const {userId} = await auth();
    if (!userId) redirect("/");

    return (
        <div className="p-8 space-y-4">
            <div className="flex justify-between items-center">
                <div className="text-3xl lg:text-4xl xl:text-5xl font-semibold">My events</div>
                <Link href={`/events/${userId}`}>
                    <Button className="w-full rounded-full">
                        <CalendarPlus width={20} height={20}/>
                        Create new event
                    </Button>
                </Link>
            </div>


            <SellerEventList/>
        </div>
    );
};

export default SellerEventsPage;