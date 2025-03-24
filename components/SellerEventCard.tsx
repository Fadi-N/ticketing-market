import React from 'react';
import {Doc} from "@/convex/_generated/dataModel";
import {Metrics} from "@/convex/events";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {usePathname} from "next/navigation";

interface SellerEventCardProps {
    event: Doc<"events"> & {metrics: Metrics}
}

const SellerEventCard = ({event}: SellerEventCardProps) => {
    const pathname = usePathname()

    const isPastEvent = event.eventDate < Date.now();

    return (
        <Card
            className={`flex flex-col justify-between transition duration-300 ease-in-out transform ${!pathname.includes("/event/") ? "hover:cursor-pointer hover:-translate-y-1 hover:shadow-lg" : ""}`}
        >
            <CardContent className="flex flex-col h-full justify-between pt-4">
                <div className="flex flex-col space-y-2 mb-8 border-b pb-4">
                    <div className="text-xl lg:text-2xl xl:text-3xl font-medium">{event.name}</div>
                    <div>
                        <Badge className="rounded-full bg-orange-500">{event.category}</Badge>
                    </div>
                    <div className="text-base lg:text-lg xl:text-xl text-gray-400">{event.description}</div>
                </div>
            </CardContent>
        </Card>
    );
};

export default SellerEventCard;