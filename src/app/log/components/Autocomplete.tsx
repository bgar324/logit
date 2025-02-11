"use client";
import React, { useState, useEffect, useRef } from "react";
type AutocompleteProps = {
  initialValue?: string;
  onSelect: (value: string) => void;
};
export default function Autocomplete({ initialValue = "", onSelect }: AutocompleteProps) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (query.trim().length === 0) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`/api/exercises?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          const names = data.exercises.map((ex: any) => ex.name);
          setSuggestions(names);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };
    fetchSuggestions();
  }, [query]);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setShowDropdown(true);
  };
  const handleSelect = (value: string) => {
    setQuery(value);
    setShowDropdown(false);
    onSelect(value);
  };
  return (
    <div className="relative" ref={containerRef}>
      <input
        value={query}
        onChange={handleChange}
        onBlur={() => onSelect(query)}
        placeholder="movement"
        className="bg-transparent focus:outline-none placeholder:underline placeholder:underline-offset-4 text-gray-800 placeholder:gray-800 hover:underline hover:underline-offset-4 placeholder:underline-gray-800"
        autoComplete="false"
        spellCheck="false"
      />
      {showDropdown && suggestions.length > 1 && (
        <ul className="absolute bg-baseBg border rounded shadow-md mt-1 w-auto z-50 p-1">
          {suggestions.map((item) => (
            <li
              key={item}
              onClick={() => handleSelect(item)}
              className="p-2 hover:bg-gray-200 cursor-pointer duration-300 ease-in-out rounded text-base"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
