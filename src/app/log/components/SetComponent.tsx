"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

type SetData = {
  weight: number;
  reps: number;
  setNumber: number;
};

interface SetComponentProps {
  setData: SetData;
  onDelete: () => void;
  onChange: (updatedSet: SetData) => void;
}

const SetComponent: React.FC<SetComponentProps> = ({ setData, onDelete, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    onChange({ ...setData, weight: val });
  };

  const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    onChange({ ...setData, reps: val });
  };

  return (
    <div
      className="flex flex-col pl-5 outline-none"
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsFocused(false);
        }
      }}
    >
      <div className="flex flex-row justify-between items-center w-full">
        <span className="w-10 pr-5 bg-transparent text-gray-500 text-sm sm:text-base md:text-lg">
          {setData.setNumber}
        </span>
        <input
          type="text"
          value={setData.weight || ""}
          onChange={handleWeightChange}
          placeholder="weight"
          className="weight bg-transparent focus:outline-none text-gray-700 placeholder:gray-800 text-sm sm:text-base md:text-lg"
        />
        <input
          type="text"
          value={setData.reps || ""}
          onChange={handleRepsChange}
          placeholder="reps"
          className="reps bg-transparent focus:outline-none text-gray-700 placeholder:gray-800 text-sm sm:text-base md:text-lg"
        />
        <FontAwesomeIcon
          icon={faTrashCan}
          className={`text-gray-400 hover:text-red-500 hover:duration-300 ease-in-out hover:cursor-pointer text-sm sm:text-base md:text-lg 
            ${setData.setNumber === 1 || !isFocused ? "invisible" : "visible"}`}
          onClick={setData.setNumber > 1 ? onDelete : undefined}
        />
      </div>
    </div>
  );
};

export default SetComponent;
