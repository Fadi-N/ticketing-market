'use client'

import React, {useEffect, useState} from 'react';
import {useParams} from "next/navigation";
import {Card, CardContent} from "@/components/ui/card";
import Spinner from "@/components/Spinner";
import {TriangleAlert} from "lucide-react";

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
            <Card className={error ? "bg-red-500 text-white" : "bg-green-500 text-white"}>
                <CardContent className="pt-4">
                    {error ? (
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="flex items-center min-h-[200px]">
                                <TriangleAlert width={50} height={50} />
                            </div>
                            <div className="text-xl lg:text-2xl xl:text-3xl font-medium">Something went wrong</div>
                            <div className="text-base lg:text-lg xl:text-xl">
                                We couldn&apos;t refresh your account link. Please try again or contact support if the
                                problem persists.
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center">
                            <Spinner/>
                            <div className="flex flex-col space-y-2 items-center">
                                <div className="text-xl lg:text-2xl xl:text-3xl font-medium">{accountLinkCreatePending ? "Creating your account link..." : "Redirecting to stripe..."}</div>
                                {connctedAccountId && (
                                    <div className="text-base lg:text-lg xl:text-xl">Account ID: {connctedAccountId}</div>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default RefreshPage;