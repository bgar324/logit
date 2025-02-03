"use client";

import React, { useState } from "react";
import SetComponent from "./SetComponent";

const MovementComponent = ({ id }: { id: number }) => {
  const [sets, setSets] = useState<number[]>([1]);

  const addSet = () => {
    setSets((prev) => [...prev, prev.length + 1]);
  };

  const removeSet = (setNumber: number) => {
    if (setNumber > 1) {
      setSets((prevSets) => prevSets.filter((num) => num !== setNumber));
    }
  };

  return (
    <div className="flex flex-col text-xl my-2 w-min">
      <input
        autoComplete="off"
        spellCheck = "false"
        id={`movement-${id}`}
        placeholder="movement"
        className="bg-transparent focus:outline-none placeholder:underline placeholder:underline-offset-4 text-gray-800 placeholder:gray-800 underline underline-offset-4"
      />
      {sets.map((set) => (
        <div key={set} className={`movement-${id}-set`}>
          <SetComponent setNumber={set} onDelete={() => removeSet(set)} />
        </div>
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
