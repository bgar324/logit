"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

interface SetComponentProps {
  setNumber: number;
  onDelete: () => void;
}

const SetComponent: React.FC<SetComponentProps> = ({ setNumber, onDelete }) => {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const value = e.target.value;
    // Allow only numbers and one decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  return (
    <div
      className="flex flex-col pl-5"
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        // Only clear focus if the new focused element is outside this container
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsFocused(false);
        }
      }}
    >
      <div className="flex flex-row justify-between items-center w-full">
        <span className="w-10 pr-5 bg-transparent text-gray-500 text-lg">
          {setNumber}
        </span>
        <input
          type="text"
          value={weight}
          onChange={(e) => handleNumberChange(e, setWeight)}
          placeholder="weight"
          className="weight bg-transparent focus:outline-none text-gray-700 placeholder:gray-800 text-lg"
        />
        <input
          type="text"
          value={reps}
          onChange={(e) => handleNumberChange(e, setReps)}
          placeholder="reps"
          className="reps bg-transparent focus:outline-none text-gray-700 placeholder:gray-800 text-lg"
        />
        <FontAwesomeIcon
          icon={faTrashCan}
          className={`text-gray-400 hover:text-red-500 hover:duration-300 ease-in-out hover:cursor-pointer text-lg 
    ${setNumber === 1 || !isFocused ? "invisible" : "visible"}`}
          onClick={setNumber > 1 ? onDelete : undefined}
        />
      </div>
    </div>
  );
};

export default SetComponent;
