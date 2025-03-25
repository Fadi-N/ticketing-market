import React, {useState} from 'react';
import {Ban} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Id} from "@/convex/_generated/dataModel";
import {useRouter} from "next/navigation";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {refundEventTickets} from "@/app/actions/refundEventTickets";

interface CancelEventButtonProps {
    eventId: Id<"events">
}

const CancelEventButton = ({eventId}: CancelEventButtonProps) => {
    const router = useRouter();
    const cancelEvent = useMutation(api.events.cancelEvent);
    const [isCancelling, setIsCancelling] = useState(false);

    const handleCancel = async () => {
        if (!confirm("Are you sure you want to cancel? All tickets will be refunded and the event will be cancelled permanently.")) {
            return;
        }

        setIsCancelling(true);

        try {
            await refundEventTickets(eventId);
            await cancelEvent({eventId});

            router.push("/seller/events");
        }catch (error) {
            console.error("Failed to cancel event:", error);
        }finally {
            setIsCancelling(false);
        }
    }

    return (
        <Button
            variant="destructive"
            className="w-full rounded-full"
            onClick={handleCancel}
            disabled={isCancelling}
        >
            <Ban width={20} height={20}/>
            {isCancelling ? "Processing..." : "Cancel Event"}
        </Button>
    );
};

export default CancelEventButton;