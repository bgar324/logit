// MovementComponent.tsx

import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import SetComponent from "./SetComponent";

type SetItem = {
  number: number;
  type: "normal" | "drop";
};

type MovementComponentProps = {
  id: number;
  onDelete: () => void;
};

const MovementComponent = ({ id, onDelete }: MovementComponentProps) => {
  const [text, setText] = useState("");
  const [sets, setSets] = useState<SetItem[]>([{ number: 1, type: "normal" }]);
  const [isFocused, setIsFocused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
    setText(value);
  };

  const addSet = () => {
    const lastSet = sets[sets.length - 1];
    const nextNumber =
      lastSet.type === "drop"
        ? Math.floor(lastSet.number) + 1
        : lastSet.number + 1;
    setSets([...sets, { number: nextNumber, type: "normal" }]);
  };

  const addDropSet = () => {
    const lastSet = sets[sets.length - 1];
    if (lastSet.type !== "drop") {
      setSets([...sets, { number: lastSet.number + 0.5, type: "drop" }]);
    }
  };

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
      className="flex flex-col text-xl mb-2 w-min focus:outline-none relative outline-none"
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsFocused(false);
        }
      }}
    >
      <div className="flex items-center justify-between">
        <input
          value={text}
          onChange={handleTextChange}
          autoComplete="off"
          spellCheck="false"
          id={`movement-${id}`}
          placeholder="movement"
          className="bg-transparent focus:outline-none placeholder:underline placeholder:underline-offset-4 text-gray-800 placeholder:gray-800 underline underline-offset-4"
        />
        {isFocused && (
          <FontAwesomeIcon
            icon={faTrashCan}
            onClick={onDelete}
            className="text-gray-400 hover:text-red-500 hover:cursor-pointer ml-2 ease-in-out duration-300"
          />
        )}
      </div>
      {sets.map((set) => (
        <div
          key={set.number}
          className={`movement-${id}-set`}
          data-set-number={set.number}
        >
          <SetComponent
            setNumber={set.number}
            onDelete={() => removeSet(set.number)}
          />
        </div>
      ))}
      {isFocused && (
        <div className="flex flex-row w-full gap-2 text-base">
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              addSet();
            }}
            className="border rounded-full w-3/5 px-2 my-2 hover:bg-gray-200 duration-300 ease-in-out outline-none"
          >
            add set
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              addDropSet();
            }}
            className="w-2/5 border rounded-full px-2 my-2 hover:bg-gray-200 duration-300 ease-in-out outline-none"
          >
            add dropset
          </button>
        </div>
      )}
    </div>
  );
};

export default MovementComponent;
