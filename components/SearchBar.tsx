import React from 'react';
import Form from "next/form";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchBar = () => {
    return (
        <Form action="/search" className="flex space-x-4">
            <div className="w-full relative">
                <Search
                    width={20}
                    height={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 "
                />
                <Input
                    placeholder="Search"
                    className="rounded-full pl-10 !placeholder-white"
                    name="query"
                />
            </div>
        </Form>
    );
};

export default SearchBar;