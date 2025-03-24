'use client'

import React from 'react';
import EventForm from "@/components/EventForm";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import {useRouter} from "next/navigation";

const NewEventPage = () => {
    const router = useRouter();

    return (
        <div className="p-8 space-y-4">
            <div className="flex items-center justify-between">
                <Button
                    className="w-full lg:w-auto rounded-full"
                    onClick={() => router.push("/seller")}
                >
                    <ArrowLeft width={20} height={20}/>
                    Back to dashboard
                </Button>
            </div>
            <EventForm mode="create"/>
        </div>
    );
};

export default NewEventPage;