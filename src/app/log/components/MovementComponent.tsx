import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import SetComponent from "./SetComponent";
import Autocomplete from "./Autocomplete";
type SetData = {
  weight: number;
  reps: number;
  setNumber: number;
};
type MovementData = {
  id: string;
  name: string;
  sets: SetData[];
};
type MovementComponentProps = {
  movement: MovementData;
  onChange: (updatedMovement: MovementData) => void;
  onDelete: () => void;
};
const MovementComponent = ({
  movement,
  onChange,
  onDelete,
}: MovementComponentProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleNameSelect = async (newName: string) => {
    const cleaned = newName.replace(/[^A-Za-z\s]/g, "");
    onChange({ ...movement, name: cleaned });
    // try {
    //   const res = await fetch("/api/exercises", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ name: cleaned }),
    //   });
    //   if (!res.ok) {
    //     console.error("Failed to upsert exercise");
    //   }
    // } catch (error) {
    //   console.error("Error creating/upserting exercise:", error);
    // }
  };
  const addSet = () => {
    if (movement.sets.length === 0) {
      onChange({
        ...movement,
        sets: [...movement.sets, { weight: 0, reps: 0, setNumber: 1 }],
      });
    } else {
      const lastSet = movement.sets[movement.sets.length - 1];
      const nextNumber = Math.floor(lastSet.setNumber) + 1;
      onChange({
        ...movement,
        sets: [...movement.sets, { weight: 0, reps: 0, setNumber: nextNumber }],
      });
    }
  };
  const addDropSet = () => {
    if (movement.sets.length === 0) {
      onChange({
        ...movement,
        sets: [{ weight: 0, reps: 0, setNumber: 1.5 }],
      });
    } else {
      const lastSet = movement.sets[movement.sets.length - 1];
      if (lastSet.setNumber === Math.floor(lastSet.setNumber)) {
        const dropNumber = lastSet.setNumber + 0.5;
        onChange({
          ...movement,
          sets: [
            ...movement.sets,
            { weight: 0, reps: 0, setNumber: dropNumber },
          ],
        });
      }
    }
  };
  const removeSetAtIndex = (index: number) => {
    const newSets = movement.sets.filter((_, i) => i !== index);
    onChange({ ...movement, sets: newSets });
  };
  const updateSetAtIndex = (index: number, updatedSet: SetData) => {
    const newSets = [...movement.sets];
    newSets[index] = updatedSet;
    onChange({ ...movement, sets: newSets });
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
        <Autocomplete
          initialValue={movement.name}
          onSelect={handleNameSelect}
        />
        {isFocused && (
          <FontAwesomeIcon
            icon={faTrashCan}
            onClick={onDelete}
            className="text-gray-400 hover:text-red-500 hover:cursor-pointer ml-2 ease-in-out duration-300 text-base sm:text-lg md:text-xl"
          />
        )}
      </div>
      {movement.sets.map((setData, idx) => (
        <SetComponent
          key={idx}
          setData={setData}
          onChange={(updated) => updateSetAtIndex(idx, updated)}
          onDelete={() => removeSetAtIndex(idx)}
        />
      ))}
      {isFocused && (
        <div className="flex flex-row w-full gap-2 text-base">
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              addSet();
            }}
            className="border rounded-full w-3/5 px-2 my-2 hover:bg-gray-200 duration-300 ease-in-out outline-none text-xs sm:text-sm md:text-base"
          >
            add set
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              addDropSet();
            }}
            className="w-2/5 border rounded-full px-2 my-2 hover:bg-gray-200 duration-300 ease-in-out outline-none text-xs sm:text-sm md:text-base"
          >
            add dropset
          </button>
        </div>
      )}
    </div>
  );
};
export default MovementComponent;
