'use client'

import { Search, X } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { type User } from "~/types/types";
import { getInitials } from "~/utils/utils";
import Link from "next/link";


const SearchBar = () => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [foundedSearch, setFoundedSearch] = useState<User[] | undefined>(undefined)
    const { mutate: search } = api.user.usersSearch.useMutation({
        onSuccess: (data) => {
            setFoundedSearch(data)
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        if (value.length === 0) {
            search({ search: "asdfbvonpkimsdbfv;onkbsfdvno;klsdbfvnok;bsfdvnko;mbsdfvknompsdbfnkopm[" }); // it can see the empty string but when i give it a value like that it will never find that value
        } else {
            search({ search: value });
        }
    }

    return (
        <div className="w-1/2 fixed z-10 top-2 flex flex-col gap-1">
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3">
                    <Search size={20} />
                </div>
                <Input placeholder="Search for Artists..." type="search" value={searchValue} onChange={handleChange} className="w-full block ps-10" />
                {searchValue.length > 0 && <Button
                    onClick={() => setSearchValue("")}
                    variant='ghost'
                    className="bg-transparent hover:bg-transparent p-0 absolute right-3 top-1/2 transform -translate-y-1/2">
                    <X size={20} className="" />
                </Button>}
            </div>
            {
                searchValue.length > 0 &&
                <Card className="bg-background p-2 w-full flex flex-col rounded-md">
                    {foundedSearch?.length === 0 ? <div className="text-center">No artists found</div> :
                        foundedSearch?.map((user) => (
                            <Link key={user.id} className="flex self-start items-center gap-2 w-full hover:bg-accent p-2 rounded-md" href={`/${user.name}`}>
                                <Avatar className="h-8 w-8" >
                                    <AvatarImage src={user?.image ?? ""} />
                                    <AvatarFallback>{getInitials(user?.firstName ?? "", user?.lastName ?? "")}</AvatarFallback>
                                </Avatar>
                                <p className="font-bold text-sm">{user?.name}</p>
                            </Link>
                        ))}
                </Card>
            }
        </div>
    )
}
export default SearchBar