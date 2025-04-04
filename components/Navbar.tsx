'use client'

import React, { useState } from 'react';
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import {Menu, X} from "lucide-react";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <nav className="navbar flex justify-between items-center p-8 shadow">
                <Link className="hidden lg:block" href="/">
                    <div className="text-xl lg:text-2xl xl:text-3xl font-medium">
                        Ticket Marketing
                    </div>
                </Link>
                <div className="w-1/2 md:w-1/3">
                    <SearchBar/>
                </div>

                <Button
                    className="md:hidden text-white"
                    variant="link"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu className="!w-6 !h-6"/>
                </Button>

                <div className="hidden md:flex items-center space-x-4">
                    <SignedIn>
                        <div>
                            <Link href="/seller" className="border-e">
                                <Button
                                    className="text-white lg:text-lg xl:text-xl"
                                    variant="link"
                                >
                                    Dashboard
                                </Button>
                            </Link>
                            <Link href="/seller/events" className="border-e">
                                <Button
                                    className="text-white lg:text-lg xl:text-xl"
                                    variant="link"
                                >
                                    My events
                                </Button>
                            </Link>
                            <Link href="/tickets" className="border-e">
                                <Button
                                    className="text-white lg:text-lg xl:text-xl"
                                    variant="link"
                                >
                                    My tickets
                                </Button>
                            </Link>
                        </div>
                        <UserButton/>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button
                                className="text-white lg:text-lg xl:text-xl"
                                variant="link"
                            >
                                Sign In
                            </Button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </nav>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-gradient-to-b from-[#7a9496] to-[#afa59d] opacity-90 z-50 md:hidden">
                    <div className="flex flex-col h-full">
                        <div className="flex justify-end p-4">
                            <Button
                                className="text-white text-xl"
                                variant="link"
                                onClick={() => setIsMobileMenuOpen(false)}

                            >
                                <X className="!w-6 !h-6"/>
                            </Button>
                        </div>

                        <div className="flex flex-col items-center justify-center flex-1 space-y-8">
                            <SignedIn>
                                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button
                                        className="text-white text-xl w-full"
                                        variant="link"
                                    >
                                        Home
                                    </Button>
                                </Link>
                                <Link href="/seller" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button
                                        className="text-white text-xl w-full"
                                        variant="link"
                                    >
                                        Dashboard
                                    </Button>
                                </Link>
                                <Link href="/seller/events" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button
                                        className="text-white text-xl w-full"
                                        variant="link"
                                    >
                                        My events
                                    </Button>
                                </Link>
                                <Link href="/tickets" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button
                                        className="text-white text-xl w-full"
                                        variant="link"
                                    >
                                        My tickets
                                    </Button>
                                </Link>
                                <div className="pt-4">
                                    <UserButton/>
                                </div>
                            </SignedIn>
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <Button
                                        className="text-white text-xl w-full"
                                        variant="link"
                                    >
                                        Sign In
                                    </Button>
                                </SignInButton>
                            </SignedOut>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;