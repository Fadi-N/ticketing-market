import React from 'react';
import Link from "next/link";
import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";

const Navbar = () => {
    return (
        <>
            <nav className="navbar flex justify-between items-center p-8 shadow">
                <Link href="/">
                    <div className="text-xl lg:text-2xl xl:text-3xl font-medium">
                        Ticket Marketing
                    </div>
                </Link>
                <div className="w-1/3">
                    <SearchBar/>
                </div>
                <div className="flex items-center space-x-4">
                    <SignedIn>
                        <Link href="/tickets" className="border-e">
                            <Button
                                className="text-white lg:text-lg xl:text-xl"
                                variant="link"
                            >
                                My tickets
                            </Button>
                        </Link>
                        <UserButton/>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button>Sign In</Button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </nav>
        </>
    );
};

export default Navbar;