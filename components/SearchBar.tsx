import React from 'react';
import Form from "next/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

const SearchBar = () => {
    return (
        <Form
            action="/search"
            className="flex space-x-4"
        >
            <Input name="query"/>
            <Button type="submit">Search</Button>
        </Form>
    );
};

export default SearchBar;