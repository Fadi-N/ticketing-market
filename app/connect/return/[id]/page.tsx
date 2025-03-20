'use client'

import React from 'react';
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {CircleCheck, CircleGauge, Info} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

const ReturnPage = () => {
    const router = useRouter();

    return (
        <div className="p-8">
            <Card>
                <CardHeader className="border-b">
                    <div className="flex items-center space-x-2 text-xl lg:text-2xl xl:text-3xl font-medium text-green-500">
                        <CircleCheck className=" text-green-500"/>
                        <span>Account connected!</span>
                    </div>
                    <div className="text-base lg:text-lg xl:text-xl text-gray-400">Your Stripe account has been
                        successfully connected
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="flex flex-col pt-4 space-y-10">
                        <div className="flex flex-col space-y-4">
                            <div className="lg:text-lg xl:text-xl font-medium">What happens next?</div>
                            <div>
                                <div className="flex items-center space-x-1">
                                    <Info width={20} height={20}/>
                                    <p>You can now create and sell tickets for events</p>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Info width={20} height={20}/>
                                    <p>Payments will be processed through your Stripe account</p>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Info width={20} height={20}/>
                                    <p>Funds will be transferred automatically</p>
                                </div>
                            </div>
                            <Button
                                className="w-full"
                                onClick={() => router.push(`/seller`)}
                            >
                                <CircleGauge width={20} height={20}/>
                                Go to Seller Dashboard
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReturnPage;