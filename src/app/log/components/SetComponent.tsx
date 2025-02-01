import React from "react";

interface SetComponentProps {
  setNumber: number;
}

const SetComponent: React.FC<SetComponentProps> = ({ setNumber }) => {
  return (
    <div className="flex flex-col pl-5 bg-red-50">
      <div className="flex flex-row justify-between items-center">
        <span className="pr-5 bg-transparent text-gray-500 text-lg">{setNumber}</span>
        <input
          placeholder="weight"
          className="bg-transparent focus:outline-none text-gray-700 placeholder:gray-800 text-lg"
        />
        <input
          placeholder="reps"
          className="bg-transparent focus:outline-none text-gray-700 placeholder:gray-800 text-lg"
        />
      </div>
    </div>
  );
};

export default SetComponent;
