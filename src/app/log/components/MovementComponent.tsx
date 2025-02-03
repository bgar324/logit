"use client";

import React, { useState, useRef } from "react";
import SetComponent from "./SetComponent";

const MovementComponent = ({ id }: { id: number }) => {
  const [text, setText] = useState("");
  const [sets, setSets] = useState<number[]>([1]);
  const [isFocused, setIsFocused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
    setText(value);
  };

  const addSet = () => {
    setSets((prev) => [...prev, prev.length + 1]);
  };

  const removeSet = (setNumber: number) => {
    if (setNumber > 1) {
      setSets((prevSets) => prevSets.filter((num) => num !== setNumber));
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col text-xl mb-2 w-min focus:outline-none ${isFocused ? 'bg-highlightColor bg-opacity-20 duration-200 ease-in-out bg-trasnparent rounded-md' : ''}`}
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        // If the newly focused element (relatedTarget) is not inside this container, clear focus.
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
        <div key={set} className={`movement-${id}-set`}>
          <SetComponent setNumber={set} onDelete={() => removeSet(set)} />
        </div>
      ))}
      {isFocused && (
        <button
          // Use onMouseDown with preventDefault to avoid the button stealing focus.
          onMouseDown={(e) => {
            e.preventDefault();
            addSet();
          }}
          className="border rounded-full mx-0 w-full px-2 my-2 text-lg hover:bg-gray-200 duration-300 ease-in-out"
        >
          add set
        </button>
      )}
    </div>
  );
};

export default MovementComponent;
