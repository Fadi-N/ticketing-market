import React from 'react';
import EventForm from "@/components/EventForm";

const NewEventPage = () => {
    return (
        <div className="p-8">
            <EventForm mode="create"/>
        </div>
    );
};

export default NewEventPage;