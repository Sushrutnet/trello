"use client";

import Image from "next/image";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useBoardStore } from "@/store/BoardStore";
import { useEffect, useState } from "react";
import fetchSuggestion from "@/lib/    fetchSuggestion";
import { UserButton } from "@clerk/nextjs";
function Header() {
  const [board, searchString, setSearchString] = useBoardStore((state) => [
    state.board,
    state.searchString,
    state.setSearchString,
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [suggestion, setSugggestion] = useState<string>("");

  useEffect(() => {
    if (board.columns.size === 0) return;
    setLoading(true);

    const fetchSuggestionFunc = async () => {
      const suggestion = await fetchSuggestion(board);
      setSugggestion(suggestion);
      setLoading(false);
    };

    fetchSuggestionFunc();
  }, [board]);

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl ">
        <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-br from-pink-400 to-[hsl(271,63%,48%)] rounded-md filter blur-3xl opacity-70 -z-50 " />
        <Image
          src="/lstfy.png"
          alt="Logo"
          width={400}
          height={150}
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain "
        />
        <div></div>
        <div className=" flex items-center flex-1 space-x-5 justify-end w-full">
          {/* search */}
          <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial  ">
            <MagnifyingGlassIcon className="h-6 w-6  text-gray-400 " />
            <input
              type="text"
              placeholder="Searh"
              className="flex-1 outline-none p-2"
              onChange={(e) => setSearchString(e.target.value)}
            ></input>
            <button hidden>Search Your Todo</button>
          </form>
          <div className="relative w-12 h-12 hover:scale-150 ">
            <div className="w-12 h-12">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center px-5 md:py-5">
        <p className=" flex items-center text-sm font-light pe-5 py-2 shadow-xl rounded-xl w-fit bg-white  italic max-w-3xl text-[#4933FF]">
          <UserCircleIcon
            className={`inline-block h-10 w-10 [blue] mr-1
          ${loading && "animate-spin"}
          `}
          />
          {suggestion && !loading
            ? suggestion
            : "Gpt is summarising your taask for the day... "}
        </p>
      </div>
    </header>
  );
}

export default Header;
