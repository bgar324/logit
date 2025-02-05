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
  const [allTags, setAllTags] = useState<string[]>([]); // Full list of tags
  const [filterValue, setFilterValue] = useState(""); // For filtering
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [newTagValue, setNewTagValue] = useState("");

  // Fetch existing tags from DB (optional). Or you can skip this if you have your own approach.
  useEffect(() => {
    // If you prefer a static list, you can remove this fetch call and just do setAllTags([ 'push', 'pull', ... ])
    const fetchTags = async () => {
      try {
        const res = await fetch("/api/tags", { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          // data.tags is an array of Tag objects; map them to strings
          setAllTags(data.tags.map((t: { name: string }) => t.name));
        }
      } catch (err) {
        console.error("Error fetching tags:", err);
        // fallback to a static list if desired
        setAllTags(["push", "pull", "legs", "arms", "chest and back"]);
      }
    };

    fetchTags();
  }, []);

  const handleDeleteTag = async (tagName: string) => {
    try {
      // Delete from DB
      const res = await fetch(`/api/tags?name=${encodeURIComponent(tagName)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Remove from local state
        setAllTags((prev) => prev.filter((t) => t !== tagName));
      } else {
        console.error("Failed to delete tag:", await res.text());
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  // Filter the tags based on input
  const filteredTags = allTags.filter((tag) =>
    tag.toLowerCase().includes(filterValue.toLowerCase())
  );

  // POST new tag to server
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
        // data.tag.name is the newly-created (or existing) tag
        const createdTag = data.tag.name;

        // Add to local state if it doesn’t already exist
        setAllTags((prev) =>
          prev.includes(createdTag) ? prev : [...prev, createdTag]
        );

        // If you want to auto-select it, call onTagSelect here or not
        onTagSelect(createdTag);

        // Clear and hide the input
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
        <div className="flex items-center justify-between gap-2">
          {/* Filter input */}
          <input
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="type to filter"
            className="rounded-lg bg-gray-200 w-56 p-2 focus:outline-none"
          />

          {/* Plus button to show the "new tag" input */}
          <button
            className="rounded-full bg-green-100 hover:bg-green-200 duration-300 ease-in-out px-3 pb-[2px] text-lg mr-5"
            onClick={() => setShowNewTagInput(true)}
          >
            +
          </button>
        </div>

        {showNewTagInput && (
          <div className="w-0 h-10 rounded-full flex flex-row items-center justify-between mt-2">
            <input
              type="text"
              placeholder="new tag..."
              value={newTagValue}
              onChange={(e) => setNewTagValue(e.target.value)}
              className="w-36 border rounded-full bg-gray-200 focus:outline-none pl-2 outline-none"
            />
            {newTagValue.trim().length > 0 && (
              <button
                className="text-green-600 ml-2"
                onClick={handleCreateNewTag}
              >
                <FontAwesomeIcon icon={faCheckCircle} />
              </button>
            )}
            <button
              className="text-gray-700 ml-2"
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
                 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm 
                 whitespace-nowrap hover:cursor-pointer min-w-12 w-auto"
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
                group-hover:duration-300
                group-hover:ease-in-out
                text-red-600
                hover:text-red-800"
              >
                <FontAwesomeIcon icon={faXmarkCircle} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        className="absolute top-2 right-2 text-gray-700 hover:text-gray-600"
        onClick={onClose}
      >
        <FontAwesomeIcon icon={faXmarkCircle} />
      </button>
    </div>
  );
};

export default TagFilter;
