'use client'

import React, {useTransition} from 'react';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Id} from "@/convex/_generated/dataModel";
import {useUser} from "@clerk/nextjs";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useRouter} from "next/navigation";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

const formSchema = z.object({
    name: z.string().min(1, "Event name is required"),
    category: z.string().min(1, "Event category is required"),
    description: z.string().min(1, "Event description is required"),
    location: z.string().min(1, "Event location is required"),
    eventDate: z.date().min(new Date(new Date().setHours(0, 0, 0, 0)), "Event date must be in the future"),
    price: z.number().min(1, "Event price must be 0 or greater than 0"),
    totalTickets: z.number().min(1, "Event total tickets must be greater than 0"),
    salesStart: z.date().min(new Date(new Date().setHours(0, 0, 0, 0)), "Event start date must be in the future"),
    salesEnd: z.date().min(new Date(new Date().setHours(0, 0, 0, 0)), "Event end date must be in the future"),
})

type FormData = z.infer<typeof formSchema>

interface initialEventData {
    _id: Id<"events">,
    name: string,
    category: string,
    description: string,
    location: string,
    eventDate: number,
    price: number,
    totalTickets: number,
    salesStart: number,
    salesEnd: number
}

interface EventFormProps {
    mode: "create" | "update",
    initialData?: initialEventData
}

const EventForm = ({mode, initialData}: EventFormProps) => {
    const {user} = useUser();
    const router = useRouter();

    const createEvent = useMutation(api.events.createEvent);
    const updateEvent = useMutation(api.events.updateEvent);

    const [isPending, startTransition] = useTransition();


    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name ?? "",
            category: initialData?.category ?? "",
            description: initialData?.description ?? "",
            location: initialData?.location ?? "",
            eventDate: initialData ? new Date(initialData.eventDate) : new Date(),
            price: initialData?.price ?? 0,
            totalTickets: initialData?.totalTickets ?? 1,
            salesStart: initialData ? new Date(initialData.salesStart) : new Date(),
            salesEnd: initialData ? new Date(initialData.salesEnd) : new Date(),
        }
    });

    const onSubmit = async (values: FormData) => {
        if (!user?.id) return;

        startTransition(async () => {
            try {
                if (mode === "create") {
                    const eventId = await createEvent({
                        ...values,
                        userId: user.id,
                        eventDate: values.eventDate.getTime(),
                        salesStart: values.salesStart.getTime(),
                        salesEnd: values.salesEnd.getTime()
                    })

                    router.push(`/event/${eventId}`);
                } else {
                    if (!initialData) {
                        throw new Error("Initial event data is required for updates");
                    }

                    await updateEvent({
                        ...values,
                        eventId: initialData._id,
                        eventDate: values.eventDate.getTime(),
                        salesStart: values.salesStart.getTime(),
                        salesEnd: values.salesEnd.getTime()
                    })

                    router.push(`/event/${initialData._id}`);
                }
            } catch (error) {
                console.error("Failed to handle event:", error);
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader className="border-b">
                        <div className="text-xl lg:text-2xl xl:text-3xl font-medium">{mode === "create" ? "Create event" : "Edit event"}</div>
                        <div className="text-base lg:text-lg xl:text-xl text-gray-400">{mode === "create" ? "Create your event" : "Update your event details"}</div>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-12 pt-4">
                        <div className="flex flex-col space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Event name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Event category</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Event description</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="location"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Event location</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="eventDate"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Event Date</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(
                                                        e.target.value ? new Date(e.target.value) : null
                                                    );
                                                }}
                                                value={
                                                    field.value
                                                        ? new Date(field.value).toISOString().split("T")[0]
                                                        : ""
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="price"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Price per Ticket</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2">
                                          $
                                        </span>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                    className="pl-6"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="totalTickets"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Total Tickets Available</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="salesStart"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Event sales start</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(
                                                        e.target.value ? new Date(e.target.value) : null
                                                    );
                                                }}
                                                value={
                                                    field.value
                                                        ? new Date(field.value).toISOString().split("T")[0]
                                                        : ""
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="salesEnd"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Event sales end</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(
                                                        e.target.value ? new Date(e.target.value) : null
                                                    );
                                                }}
                                                value={
                                                    field.value
                                                        ? new Date(field.value).toISOString().split("T")[0]
                                                        : ""
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button
                            className="w-full"
                            type="submit"
                            onSubmit={onSubmit}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="animate-spin" width={20} height={20}/>
                                    {mode === "create" ? "Creating Event..." : "Updating Event..."}
                                </>
                            ) : mode === "create" ? (
                                "Create Event"
                            ) : (
                                "Update Event"
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
};

export default EventForm;