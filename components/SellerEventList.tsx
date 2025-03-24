import React from 'react';
import {useUser} from "@clerk/nextjs";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import SellerEventCard from "@/components/SellerEventCard";

const SellerEventList = () => {
    const {user} = useUser();

    const events = useQuery(api.events.getSellerEvents, {userId: user?.id ?? ""});
    if (!events) return null;

    const upcomingEvents = events.filter((e) => e.eventDate > Date.now());
    const pastEvents = events.filter((e) => e.eventDate <= Date.now());

    return (
        <div className="p-8">
            {upcomingEvents.length > 0 && (
                <div>
                    <div className="text-xl lg:text-2xl xl:text-3xl font-medium">Upcoming events</div>
                    <div>
                        {upcomingEvents.map((event) => (
                            <SellerEventCard key={event._id} event={event}/>
                        ))}
                    </div>
                </div>
            )}

            {pastEvents.length > 0 && (
                <div>
                    <div className="text-xl lg:text-2xl xl:text-3xl font-medium">Past events</div>
                    <div>
                        {pastEvents.map((event) => (
                            <SellerEventCard key={event._id} event={event}/>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerEventList;