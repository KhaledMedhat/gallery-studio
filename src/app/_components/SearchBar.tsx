"use client";

import { LoaderCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { getInitials } from "~/utils/utils";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { CommandDialog, CommandEmpty, CommandGroup, CommandList, CommandSeparator } from "~/components/ui/command";

const SearchBar = () => {
  const { scrollYProgress } = useScroll();

  const [visible, setVisible] = useState<boolean>(false);
  useEffect(() => {
    setVisible(true);
  }, []);
  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      const direction = current - scrollYProgress.getPrevious()!;
      if (scrollYProgress.get() < 0) {
        setVisible(false);
      }
      else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });
  const [searchValue, setSearchValue] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const {
    mutate: search,
    isPending,
    data: searchResult,
  } = api.user.usersSearch.useMutation();

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

    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className="container w-3/4 md:w-1/4 fixed top-2 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-md dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-10"
      >
        <Button variant="ghost" className="w-full p-0 justify-start pl-2 z-0" onClick={() => setIsDialogOpen(true)}>Search for Artists or Tags ...</Button>

        <CommandDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input value={searchValue} onChange={handleChange} className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          {searchValue.length > 0 &&
            <CommandList>
              {isPending ? <div className="p-4">
                <LoaderCircle size={25} className="m-auto animate-spin" />
              </div> : <>
                {searchResult?.foundedUsers.length === 0 && searchResult?.foundedTag.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}
                {searchResult?.foundedUsers.length !== 0 &&
                  <CommandGroup heading="Accounts" >
                    {searchResult?.foundedUsers.map((user) => (
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
                    ))}
                  </CommandGroup>
                }
                <CommandSeparator />
                {searchResult?.foundedTag.length !== 0 &&
                  <CommandGroup heading="Tags" >
                    {searchResult?.foundedTag.map((tag) => (
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
                  </CommandGroup>
                }

              </>
              }
            </CommandList>
          }
        </CommandDialog>
      </motion.div>
    </AnimatePresence>
  );
};
export default SearchBar;
