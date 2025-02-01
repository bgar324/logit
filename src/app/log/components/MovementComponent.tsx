"use client";

import React, { useState } from "react";
import SetComponent from "./SetComponent";

const MovementComponent = () => {
  const [sets, setSets] = useState<number[]>([1]);

  const addSet = () => {
    setSets([...sets, sets.length + 1]);
  };

  return (
    <div className="flex flex-col text-xl my-2 w-min ">
      <input
        placeholder="movement"
        className="bg-transparent focus:outline-none placeholder:underline text-gray-800 placeholder:gray-800 underline"
      />

      {/* <SetComponent setNumber={1} /> */}

      {sets.map((set, index) => (
        <SetComponent key={index} setNumber={set} />
      ))}
      <button
        onClick={addSet}
        className="border rounded-full mx-0 w-full px-2 my-2 text-lg hover:bg-gray-200 duration-300 ease-in-out"
      >
        add set
      </button>
    </div>
  );
};

export default MovementComponent;
