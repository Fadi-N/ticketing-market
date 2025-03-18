import React from 'react';
import SellerDashboard from "@/components/SellerDashboard";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";

const SellerPage = async () => {
    const {userId} = await auth();
    if (!userId) {
        redirect("/")
    }

    return (
        <div>
            <SellerDashboard/>
        </div>
    );
};

export default SellerPage;