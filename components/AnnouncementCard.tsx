import React from 'react';
import {Card, CardContent} from "@/components/ui/card";

interface AnnouncementCardProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    customClass?: string;
}

const AnnouncementCard = ({icon, title, description, customClass}: AnnouncementCardProps) => {
    return (
        <Card className={customClass && customClass}>
            <CardContent className="pt-4">
                <div className="flex flex-col items-center justify-center space-y-2">
                    <div className={description ? "flex items-center min-h-[100px] lg:min-h-[200px]" : "flex items-center min-h-[50px] lg:min-h-[100px]"}>
                        {icon && icon}
                    </div>
                    <div className="text-xl lg:text-2xl xl:text-3xl font-medium">{title}</div>
                    {description && <div className="text-base lg:text-lg xl:text-xl">{description}</div>}
                </div>

            </CardContent>
        </Card>
    );
};

export default AnnouncementCard;