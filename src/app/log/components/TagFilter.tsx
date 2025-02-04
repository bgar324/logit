"use client";

import React, { useEffect, useState } from "react";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface TagFilterProps {
  onClose: () => void;
  onTagSelect: (tag: string) => void;
}

const TagFilter = ({ onClose, onTagSelect }: TagFilterProps) => {
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    // For now, we use a static list of tags
    setTags(["push", "pull", "legs", "arms", "chest and back"]);
  }, []);

  return (
    <div className="flex flex-row w-80 bg-white shadow-md rounded-lg p-3 absolute mt-24 z-50">
      <div className="flex flex-col">
        <div className="flex items-center justify-between w-full gap-2">
          <input
            placeholder="type to filter"
            className="rounded-lg bg-gray-200 w-56 p-2 focus:outline-none"
          />
          <button className="rounded-full bg-blue-100 px-3 pb-[2px] text-lg mr-5">
            +
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              onClick={() => onTagSelect(tag)}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm whitespace-nowrap hover:cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <button className="absolute top-2 right-2 text-gray-700" onClick={onClose}>
        <FontAwesomeIcon icon={faXmarkCircle} />
      </button>
    </div>
  );
};

export default TagFilter;
