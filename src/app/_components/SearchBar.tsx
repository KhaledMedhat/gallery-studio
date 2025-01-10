"use client";

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
  const [foundedSearch, setFoundedSearch] = useState<User[] | undefined>(
    undefined,
  );
  const { mutate: search } = api.user.usersSearch.useMutation({
    onSuccess: (data) => {
      setFoundedSearch(data);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value.length === 0) {
      search({
        search:
          "asdfbvonpkimsdbfv;onkbsfdvno;klsdbfvnok;bsfdvnko;mbsdfvknompsdbfnkopm[",
      }); // it can see the empty string but when i give it a value like that it will never find that value
    } else {
      search({ search: value });
    }
  };

  return (
    <div className="fixed top-2 z-10 flex w-1/2 flex-col gap-1">
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3">
          <Search size={20} />
        </div>
        <Input
          placeholder="Search for Artists..."
          type="search"
          value={searchValue}
          onChange={handleChange}
          className="block w-full ps-10"
        />
        {searchValue.length > 0 && (
          <Button
            onClick={() => setSearchValue("")}
            variant="ghost"
            className="absolute right-3 top-1/2 -translate-y-1/2 transform bg-transparent p-0 hover:bg-transparent"
          >
            <X size={20} className="" />
          </Button>
        )}
      </div>
      {searchValue.length > 0 && (
        <Card className="flex w-full flex-col rounded-md bg-background p-2">
          {foundedSearch?.length === 0 ? (
            <div className="text-center">No artists found</div>
          ) : (
            foundedSearch?.map((user) => (
              <Link
                key={user.id}
                className="flex w-full items-center gap-2 self-start rounded-md p-2 hover:bg-accent"
                href={`/${user.name}`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image?.imageUrl ?? ""} />
                  <AvatarFallback>
                    {getInitials(user?.firstName ?? "", user?.lastName ?? "")}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-bold">{user?.name}</p>
              </Link>
            ))
          )}
        </Card>
      )}
    </div>
  );
};
export default SearchBar;
