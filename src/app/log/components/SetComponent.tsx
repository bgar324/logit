import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

interface SetComponentProps {
  setNumber: number;
  onDelete: () => void;
}

const SetComponent: React.FC<SetComponentProps> = ({ setNumber, onDelete }) => {
  return (
    <div className="flex flex-col pl-5">
      <div className="flex flex-row justify-between items-center w-full">
        <span className="pr-5 bg-transparent text-gray-500 text-lg">{setNumber}</span>
        <input
          placeholder="weight"
          className="weight bg-transparent focus:outline-none text-gray-700 placeholder:gray-800 text-lg"
        />
        <input
          placeholder="reps"
          className="reps bg-transparent focus:outline-none text-gray-700 placeholder:gray-800 text-lg"
        />
        <FontAwesomeIcon
          icon={faTrashCan}
          className={`text-gray-400 hover:text-red-500 ease-in-out duration-300 hover:cursor-pointer text-lg ${setNumber === 1 ? "invisible" : "visible"}`}
          onClick={setNumber > 1 ? onDelete : undefined}
        />
      </div>
    </div>
  );
};

export default SetComponent;
