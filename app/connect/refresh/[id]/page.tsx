'use client'

import React, {useEffect, useState} from 'react';
import {useParams} from "next/navigation";
import Spinner from "@/components/Spinner";
import {TriangleAlert} from "lucide-react";
import AnnouncementCard from "@/components/AnnouncementCard";

const RefreshPage = () => {
    const params = useParams();
    const connctedAccountId = params.id as string;
    const [accountLinkCreatePending, setAccountLinkCreatePending] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const createAccountLink = async () => {
            if (connctedAccountId) {
                setAccountLinkCreatePending(true);
                setError(false);

                try {

                } catch (error) {
                    console.error("Error creating account link:", error);
                    setError(true);
                }

                setAccountLinkCreatePending(false);
            }
        }

        createAccountLink();
    }, [connctedAccountId])

    return (
        <div className="p-8">
            {!error ? (
                <AnnouncementCard
                    icon={<TriangleAlert className="w-12 h-12 lg:w-20 lg:h-20"/>}
                    title="Something went wrong"
                    description="We couldn&apos;t refresh your account link. Please try again"
                    customClass="bg-red-100 text-red-500"
                />
            ) : (
                <AnnouncementCard
                    icon={<Spinner variant={!error ? "error" : "success"}/>}
                    title={accountLinkCreatePending ? "Creating your account link..." : "Redirecting to stripe..."}
                    description={`Account ID: ${connctedAccountId}`}
                    customClass="bg-green-100 text-green-500"
                />
            )}
        </div>
    );
};

export default RefreshPage;