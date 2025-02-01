"use client"

import React, { useState } from "react";
import MovementComponent from "./components/MovementComponent";

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

  return (
    <div className="flex items-center justify-center">
      <div className="bg-blue-50 flex flex-col w-1/2 mx-auto h-full px-32 pt-32 pb-10">
        <h1 className="text-2xl underline underline-offset-4 sticky z-50 top-0 bg-baseBg">{formattedDate}</h1>
        <div className="bg-yellow-50 w-min">
          <button className="border rounded-full mx-0 w-10 px-2 my-2 hover:w-20 transition-all duration-300 ease-in-out">
            +
          </button>
          <input
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
          />
        </div>
        {/* <MovementComponent /> */}
        {movements.map((id) => (
          <MovementComponent key={id} />
        ))}
        <button
          className="border rounded-full mx-auto w-40 px-2 my-2"
          onClick={addMovement}
        >
          add movement
        </button>
      </div>
    </div>
  );
}