"use client";

import React, { useEffect, useState } from "react";
import {
  faXmarkCircle,
  faCheckCircle,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface TagFilterProps {
  onClose: () => void;
  onTagSelect: (tag: string) => void;
}

const TagFilter = ({ onClose, onTagSelect }: TagFilterProps) => {
  const [allTags, setAllTags] = useState<string[]>([]); 
  const [filterValue, setFilterValue] = useState(""); 
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [newTagValue, setNewTagValue] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("/api/tags", { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          setAllTags(data.tags.map((t: { name: string }) => t.name));
        }
      } catch (err) {
        console.error("Error fetching tags:", err);
        setAllTags(["push", "pull", "legs", "arms", "chest and back"]);
      }
    };

    fetchTags();
  }, []);

  const handleDeleteTag = async (tagName: string) => {
    try {
      const res = await fetch(`/api/tags?name=${encodeURIComponent(tagName)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setAllTags((prev) => prev.filter((t) => t !== tagName));
      } else {
        console.error("Failed to delete tag:", await res.text());
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  const filteredTags = allTags.filter((tag) =>
    tag.toLowerCase().includes(filterValue.toLowerCase())
  );

  const handleCreateNewTag = async () => {
    const trimmed = newTagValue.trim();
    if (!trimmed) return;

    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: trimmed }),
      });

      if (res.ok) {
        const data = await res.json();
        const createdTag = data.tag.name;

        setAllTags((prev) =>
          prev.includes(createdTag) ? prev : [...prev, createdTag]
        );

        onTagSelect(createdTag);

        setNewTagValue("");
        setShowNewTagInput(false);
      } else {
        console.error("Failed to create tag");
      }
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  };

  return (
    <div className="flex flex-row w-80 bg-white shadow-md rounded-lg p-3 absolute mt-24 z-50">
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between gap-2 text-3xl">
          <input
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="type to filter"
            className="rounded-lg bg-gray-200 w-56 p-2 focus:outline-none text-xs sm:text-sm md:text-base"
          />
          <button
            className="rounded-full bg-green-100 hover:bg-green-200 duration-300 ease-in-out px-3 pb-[2px] mr-5 text-sm sm:text-md md:text-lg"
            onClick={() => setShowNewTagInput(true)}
          >
            +
          </button>
        </div>

        {showNewTagInput && (
          <div className="w-0 h-10 rounded-full flex flex-row items-center justify-between mt-2 ">
            <input
              type="text"
              placeholder="new tag..."
              value={newTagValue}
              onChange={(e) => setNewTagValue(e.target.value)}
              className="w-36 border rounded-full bg-gray-200 focus:outline-none pl-2 outline-none text-xs sm:text-sm md:text-base"
            />
            {newTagValue.trim().length > 0 && (
              <button
                className="text-green-600 ml-2 text-xs sm:text-sm md:text-base"
                onClick={handleCreateNewTag}
              >
                <FontAwesomeIcon icon={faCheckCircle} />
              </button>
            )}
            <button
              className="text-gray-700 ml-2 text-xs sm:text-sm md:text-base"
              onClick={() => {
                setShowNewTagInput(false);
                setNewTagValue("");
              }}
            >
              <FontAwesomeIcon icon={faXmarkCircle} />
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          {filteredTags.map((tag, index) => (
            <div
              key={tag}
              className="relative group flex items-center 
                 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs md:text-sm 
                 whitespace-nowrap hover:cursor-pointer min-w-11 w-auto"
            >
              <span onClick={() => onTagSelect(tag)}>{tag}</span>

              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  await handleDeleteTag(tag);
                }}
                className="
                -ml-3
                group-hover:ml-2
                opacity-0
                group-hover:opacity-100

                transition-none

                group-hover:transition-all
                group-hover:duration-200
                group-hover:ease-in-out
                text-red-600
                hover:text-red-800
                text-xs sm:text-sm md:text-base"
              >
                <FontAwesomeIcon icon={faXmarkCircle} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        className="absolute top-2 right-2 text-gray-700 hover:text-gray-600 text-xs sm:text-sm md:text-base"
        onClick={onClose}
      >
        <FontAwesomeIcon icon={faXmarkCircle} />
      </button>
    </div>
  );
};

export default TagFilter;
