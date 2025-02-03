// MovementComponent.tsx

import React, { useState, useRef } from "react";
import SetComponent from "./SetComponent";

type SetItem = {
  number: number;
  type: "normal" | "drop";
};

const MovementComponent = ({ id }: { id: number }) => {
  const [text, setText] = useState("");
  const [sets, setSets] = useState<SetItem[]>([{ number: 1, type: "normal" }]);
  const [isFocused, setIsFocused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
    setText(value);
  };

  // When clicking "add set" (the normal set button)
  const addSet = () => {
    const lastSet = sets[sets.length - 1];
    // If the last set is a drop set, then the new set should be the next integer
    const nextNumber =
      lastSet.type === "drop"
        ? Math.floor(lastSet.number) + 1
        : lastSet.number + 1;
    setSets([...sets, { number: nextNumber, type: "normal" }]);
  };

  // When clicking "add drop set"
  const addDropSet = () => {
    const lastSet = sets[sets.length - 1];
    // Only allow one drop set per normal set (adjust logic as needed)
    if (lastSet.type !== "drop") {
      setSets([...sets, { number: lastSet.number + 0.5, type: "drop" }]);
    }
  };

  // If you need to remove a set (adjust the removal logic if drop sets
  // should be removable or not)
  const removeSet = (setNumber: number) => {
    if (setNumber !== 1) {
      setSets((prevSets) =>
        prevSets.filter((item) => item.number !== setNumber)
      );
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col text-xl mb-2 w-min focus:outline-none ${
        isFocused
          ? ""
          : ""
      }`}
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsFocused(false);
        }
      }}
    >
      <input
        value={text}
        onChange={handleTextChange}
        autoComplete="off"
        spellCheck="false"
        id={`movement-${id}`}
        placeholder="movement"
        className="bg-transparent focus:outline-none placeholder:underline placeholder:underline-offset-4 text-gray-800 placeholder:gray-800 underline underline-offset-4"
      />
      {sets.map((set) => (
        <div
          key={set.number}
          className={`movement-${id}-set`}
          data-set-number={set.number} // store the set number as a data attribute
        >
          <SetComponent setNumber={set.number} onDelete={() => removeSet(set.number)} />
        </div>
      ))}
      {isFocused && (
        <div className="flex flex-row w-full gap-2 text-base">
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              addSet();
            }}
            className="border rounded-full mx-0 w-3/5 px-2 my-2 hover:bg-gray-200 duration-300 ease-in-out"
          >
            add set
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              addDropSet();
            }}
            className="w-2/5 border rounded-full mx-0 px-2 my-2 hover:bg-gray-200 duration-300 ease-in-out"
          >
            add dropset
          </button>
        </div>
      )}
    </div>
  );
};

export default MovementComponent;
