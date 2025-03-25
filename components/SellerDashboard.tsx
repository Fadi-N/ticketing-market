'use client'

import React, {useEffect, useState} from 'react';
import {AccountStatus, getStripeConnectAccountStatus} from "@/app/actions/getStripeConnectAccountStatus";
import {useRouter} from "next/navigation";
import {useUser} from "@clerk/nextjs";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {createStripeConnectLoginLink} from "@/app/actions/createStripeConnectLoginLink";
import {Button} from "@/components/ui/button";
import {
    CalendarDays,
    CalendarPlus,
    CircleCheck,
    CircleX,
    Gem,
    TriangleAlert,
    RefreshCw,
    CircleGauge, ListTodo
} from "lucide-react";
import {createStripeConnectCustomer} from "@/app/actions/createStripeConnectCustomer";
import {Card, CardContent} from "@/components/ui/card";
import Spinner from "@/components/Spinner";
import {createStripeConnectAccountLink} from "@/app/actions/CreateStripeConnectAccountLink";

const SellerDashboard = () => {
    const [accountCreatePending, setAccountCreatePending] = useState(false);
    const [accountLinkCreatePending] = useState(false);
    const [error, setError] = useState(false);
    const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);

    const router = useRouter();
    const {user} = useUser();

    const stripeConnectId = useQuery(api.users.getUsersStripeConnectId, {userId: user?.id || ""});

    const isReadyToAcceptPayments = accountStatus?.isActive && accountStatus?.payoutEnabled;

    useEffect(() => {
        if (stripeConnectId) {
            fetchAccountStatus();
        }
    }, [stripeConnectId])

    const fetchAccountStatus = async () => {
        if (stripeConnectId) {
            try {
                const status = await getStripeConnectAccountStatus(stripeConnectId);
                setAccountStatus(status);
            } catch (error) {
                console.error("Error fetching account status", error);
            }
        }
    }

    const handleManageAccount = async () => {
        try {
            if (stripeConnectId && accountStatus?.isActive) {
                const loginUrl = await createStripeConnectLoginLink(stripeConnectId);
                window.location.href = loginUrl;
            }
        } catch (error) {
            console.error("Error accessing Stripe Connect portal", error);
            setError(error);
        }
    }

    const handleCreateSellerAccount = async () => {
        setAccountCreatePending(true);
        setError(false);

        try {
            await createStripeConnectCustomer();
            setAccountCreatePending(false);
        } catch (error) {
            console.error("Error connecting Seller account with Stripe", error);
            setAccountCreatePending(false);
            setError(error);
        }
    }

    const handleCompleteRequirements = async () => {
        setAccountCreatePending(true);
        setError(false);

        try {
            const {url} =
                await createStripeConnectAccountLink(stripeConnectId);
            router.push(url);
        } catch (error) {
            console.error("Error creating Stripe Connect account link", error);
            setError(true);
        }
        setAccountCreatePending(true);
    }

    return (
        <div className="flex flex-col space-y-4 p-8 ">
            {isReadyToAcceptPayments && (
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex flex-col space-y-4">
                            <div className="text-xl lg:text-2xl xl:text-3xl font-medium">Get those event tickets sold,
                                no sweat!
                            </div>
                            <div className="text-base lg:text-lg xl:text-xl text-gray-400">List ‘em up for sale and keep
                                everything under control with a few easy clicks—your
                                events, your rules!
                            </div>
                            <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
                                <Button className="w-full rounded-full"
                                        onClick={() => router.push(`/seller/new-event`)}>
                                    <CalendarPlus width={20} height={20}/>
                                    Create new event
                                </Button>
                                <Button className="w-full rounded-full"
                                        onClick={() => router.push(`/seller/events`)}>
                                    <CalendarDays width={20} height={20}/>
                                    My Events
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
            {!stripeConnectId && !accountCreatePending && (
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex flex-col space-y-2">
                            <div className="text-xl lg:text-2xl xl:text-3xl font-medium">Begin Earning!</div>
                            <div className="text-base lg:text-lg xl:text-xl text-gray-400">Create your seller account
                                and start collecting secure payments via Stripe with
                                ease.
                            </div>
                            <div>
                                <Button className="w-full rounded-full"
                                        onClick={handleCreateSellerAccount}>
                                    <Gem width={20} height={20}/>
                                    Make That Seller Account Happen
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {stripeConnectId && accountStatus && (
                <div>
                    <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
                        <Card className="flex-1 min-h-96">
                            <CardContent className="flex lg:flex-col justify-between h-full">
                                <div className="flex flex-col pt-4 space-y-10">
                                    <div className="flex flex-col space-y-2">
                                        <div className="text-xl lg:text-2xl xl:text-3xl font-medium">
                                            Account status
                                        </div>
                                        <div className="flex">
                                            <div className={`flex items-center space-x-2 rounded-full px-4 py-0.5 ${accountStatus?.isActive ? "bg-green-100" : "bg-orange-100"}`}>
                                            <span className="relative flex size-2">
                                                <span
                                                    className={`absolute inline-flex size-full animate-ping rounded-full ${accountStatus.isActive ? "bg-green-600" : "bg-yellow-600"}`}></span><
                                                span
                                                className={`relative inline-flex size-2 rounded-full ${accountStatus.isActive ? "bg-green-500" : "bg-yellow-500"}`}></span>
                                            </span>
                                                <p className={accountStatus.isActive ? "text-green-500 text-sm" : "text-orange-500 text-sm"}>{accountStatus.isActive ? "Active" : "Pending"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <div className="text-xl lg:text-2xl xl:text-3xl font-medium">Payment
                                            capability
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-1">
                                                {accountStatus.chargesEnabled
                                                    ? <CircleCheck className="text-green-500" width={20} height={20}/>
                                                    : <CircleX className="text-red-500" width={20} height={20}/>
                                                }
                                                <p>{accountStatus.chargesEnabled ? "Can accept payments" : "Cannot accept payments yet"}</p>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                {accountStatus.chargesEnabled
                                                    ? <CircleCheck className="text-green-500" width={20} height={20}/>
                                                    : <CircleX className="text-red-500" width={20} height={20}/>
                                                }
                                                <p>{accountStatus.payoutEnabled ? "Can receive payouts" : "Cannot receive payouts yet"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {accountStatus.isActive && (
                                        <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
                                            <Button
                                                className="w-full rounded-full"
                                                onClick={handleManageAccount}
                                            >
                                                <CircleGauge width={20} height={20}/>
                                                Seller Dashboard
                                            </Button>
                                            <Button
                                                className="w-full rounded-full"
                                                onClick={fetchAccountStatus}
                                            >
                                                <RefreshCw width={20} height={20}/>
                                                Refresh Status
                                            </Button>
                                        </div>
                                    )}

                                    {error && (
                                        <div>
                                            Unable to access Stripe dashboard. Please complete all
                                            requirements first.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="flex-1">
                            <CardContent className="flex flex-col justify-between h-full pt-4">
                                <div className="flex flex-col space-y-2">
                                    <div className="text-xl lg:text-2xl xl:text-3xl font-medium">Required Information
                                    </div>
                                    <div className="flex flex-col space-y-6">
                                        <div>
                                            <div className="grid grid-cols-1 gap-4">
                                                {accountStatus.requirements.currently_due.length > 0 && (
                                                    <>
                                                        <div
                                                            className="text-base lg:text-lg xl:text-xl text-gray-400">Action
                                                            Required
                                                        </div>
                                                        <ul>
                                                            {accountStatus.requirements.currently_due.map((req) => (
                                                                <div key={req} className="flex items-center space-x-2">
                                                                    <TriangleAlert
                                                                        className="text-yellow-500"
                                                                        width={20}
                                                                        height={20}
                                                                    />
                                                                    <li>{req.replace(/_/g, " ")}</li>
                                                                </div>
                                                            ))}
                                                        </ul>
                                                    </>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 gap-4">
                                                {accountStatus.requirements.eventually_due.length > 0 && (
                                                    <>
                                                        <div
                                                            className="text-base lg:text-lg xl:text-xl text-gray-400">Eventually
                                                            Needed
                                                        </div>
                                                        <ul>
                                                            {accountStatus.requirements.eventually_due.map(
                                                                (req) => (
                                                                    <div key={req}
                                                                         className="flex items-center space-x-2">
                                                                        <TriangleAlert
                                                                            className="text-yellow-500"
                                                                            width={20} height={20}
                                                                        />
                                                                        <li key={req}>{req.replace(/_/g, " ")}</li>
                                                                    </div>
                                                                )
                                                            )}
                                                        </ul>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    className="w-full rounded-full"
                                    onClick={handleCompleteRequirements}
                                >
                                    <ListTodo width={20} height={20}/>
                                    Complete requirements
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {accountCreatePending && (
                <div className="flex flex-col items-center justify-center space-x-2">
                    <Spinner/>
                    <div className="text-xl lg:text-2xl xl:text-3xl font-medium">Creating your seller account...</div>
                </div>
            )}
            {accountLinkCreatePending && (
                <div className="flex flex-col items-center justify-center space-x-2">
                    <Spinner/>
                    <div className="text-xl lg:text-2xl xl:text-3xl font-medium">Preparing account setup...</div>
                </div>
            )}

        </div>
    );
};

export default SellerDashboard;