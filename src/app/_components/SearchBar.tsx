"use client";

import { LoaderCircle, Search, X } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { getInitials } from "~/utils/utils";
import Link from "next/link";
import { SearchType } from "~/types/types";

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredSearch, setFilteredSearch] = useState<SearchType>(
    SearchType.Accounts,
  );
  const {
    mutate: search,
    isPending,
    data: searchResult,
  } = api.user.usersSearch.useMutation();
  const filterOptions = [
    { id: SearchType.Accounts, label: "Accounts" },
    { id: SearchType.Tags, label: "Tags" },
  ];
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
    <div className=" fixed top-2 z-10 w-full lg:w-3/5 container flex flex-col gap-1">
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3">
          <Search size={20} />
        </div>
        <Input
          placeholder="Search for Artists or Tags ..."
          value={searchValue}
          onChange={handleChange}
          className="w-full ps-10 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {searchValue.length > 0 && (
          <Button
            onClick={() => setSearchValue("")}
            variant="ghost"
            className="absolute right-3 top-1/2 -translate-y-1/2 transform bg-transparent p-0 hover:bg-transparent"
          >
            <X size={20} />
          </Button>
        )}
      </div>
      {searchValue.length > 0 && (
        <Card className="flex w-full flex-col rounded-md bg-background p-2">
          {isPending ? (
            <LoaderCircle size={25} className="m-auto animate-spin" />
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                {filterOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant={
                      filteredSearch === option.id ? "default" : "outline"
                    }
                    onClick={() => setFilteredSearch(option.id)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              {filteredSearch === SearchType.Accounts
                ? searchResult?.foundedUsers.length === 0 ? <div className="text-center">No artists found</div> : searchResult?.foundedUsers.map((user) => (
                  <Link
                    key={user.id}
                    className="flex w-full items-center gap-2 self-start rounded-md p-2 hover:bg-accent"
                    href={`/${user.name}`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImage?.imageUrl ?? ""} />
                      <AvatarFallback>
                        {getInitials(
                          user?.firstName ?? "",
                          user?.lastName ?? "",
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-bold">{user?.name}</p>
                  </Link>
                ))
                : searchResult?.foundedTag.length === 0 ? <div className="text-center">No tags found</div> : searchResult?.foundedTag.map((tag) => (
                  <Link
                    key={tag.id}
                    className="flex w-full items-center gap-2 self-start rounded-md p-2 hover:bg-accent"
                    href={`/search?q=${tag.tagName.slice(1)}`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <p className="text-sm font-bold">{tag?.tagName}</p>
                      <p className="text-sm text-muted-foreground">
                        {tag?.tagUsedCount} {tag.tagUsedCount > 100 && "+"}{" "}
                        {tag.tagUsedCount > 1 ? "showcases" : "showcase"}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
export default SearchBar;
