"use client"

import React, { useState } from "react";
import MovementComponent from "./components/MovementComponent";
import TagFilter from "./components/TagFilter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "tailwindcss/tailwind.css";

export default function LogPage() {
  // retrieving the date
  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
  })
    .format(today)
    .toLowerCase();

  const [movements, setMovements] = useState<number[]>([1]);

  const addMovement = () => {
    setMovements((prev) => [...prev, prev.length]);
  };

  const [showTagFilter, setShowTagFilter] = useState(false);

  return (
    <div className="flex items-center justify-center">
      <div className=" flex flex-col w-min mx-auto h-full pt-32 px-32 pb-5">
        <h1 className="bg-baseBg text-2xl underline underline-offset-4 sticky z-50 top-0 ">{formattedDate}
          <FontAwesomeIcon icon={faComment} className="text-lg ml-2" />
        </h1>
        <div className="w-min">
          <button className="border rounded-full mx-0 w-10 px-2 mt-4 mb-2 hover:bg-gray-200 duration-300 ease-in-out" onClick={() => setShowTagFilter(true)}>
            +
          </button>
          {/* <input
            placeholder="any notes?"
            className="
              placeholder:italic 
              placeholder-gray-400 
              bg-transparent 
              placeholder:underline 
              italic 
              text-gray-400 
              focus:outline-none 
              underline 
              caret-transparent 
              focus:placeholder-font-semibold
            "
            type="text"
            spellCheck="false"
          /> */}
          {showTagFilter && <TagFilter />}
        </div>
        {movements.map((id) => (
          <MovementComponent key={id} />
        ))}
        <button
          className="border rounded-full flex items-center justify-center mx-auto w-40 px-2 my-2 hover:bg-gray-200 duration-300 ease-in-out"
          onClick={addMovement}
        >
          add movement
        </button>
      </div>
    </div>
  );
}