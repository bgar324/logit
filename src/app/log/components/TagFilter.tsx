"use client";

import React, { useEffect, useState } from "react";

const TagFilter = () => {
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/tags", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }
      const data = await response.json();
      console.log("Fetched data:", data);
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  return (
    <div className="w-72 bg-white shadow-md rounded-lg p-3 absolute -mt-7">
      <div className="flex items-center justify-between w-full">
        <input placeholder="type to filter" className="rounded-lg bg-gray-200 w-56 p-2" />
        <button className="rounded-full bg-blue-100 px-3 pb-[2px] text-lg">+</button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag, index) => (
          <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm whitespace-nowrap">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;
