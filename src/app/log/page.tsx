"use client";

import React, { useState } from "react";
import MovementComponent from "./components/MovementComponent";
import TagFilter from "./components/TagFilter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import CommentBox from "./components/CommentBox";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "tailwindcss/tailwind.css";

export default function LogPage() {
  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
  })
    .format(today)
    .toLowerCase();

  const [movements, setMovements] = useState<number[]>([1]);
  const [movementCount, setMovementCount] = useState(2);

  const addMovement = () => {
    setMovements((prev) => [...prev, movementCount]);
    setMovementCount((prev) => prev + 1);
  };

  const handleAddMovement = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    addMovement();
  };

  const [showTagFilter, setShowTagFilter] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [savedComment, setSavedComment] = useState<string | null>(null);

  const handleSaveComment = (comment: string) => {
    if (comment.trim()) {
      setSavedComment(comment);
      setShowCommentBox(false);
    }
  };

  const handleDeleteComment = () => {
    setSavedComment(null);
    setShowCommentBox(false);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]));
    setShowTagFilter(false);
  };

  const handleLogWorkout = async () => {
    const workoutData = {
      formattedDate,
      notes: savedComment,
      tags: selectedTags, // Sending an array of tag strings
      movements: movements.map((id) => ({
        name:
          (document.getElementById(`movement-${id}`) as HTMLInputElement)
            ?.value || "",
        sets: Array.from(document.querySelectorAll(`.movement-${id}-set`)).map(
          (setEl: any) => ({
            weight: parseFloat(setEl.querySelector(".weight")?.value) || 0,
            reps: parseInt(setEl.querySelector(".reps")?.value) || 0,
          })
        ),
      })),
    };

    console.log("Submitting Workout:", workoutData);

    try {
      const response = await fetch("/api/log-workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workoutData),
      });

      if (response.ok) {
        console.log("Workout logged successfully!");
      } else {
        console.error("Failed to log workout");
      }
    } catch (error) {
      console.error("Error logging workout:", error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center">
      <div className="flex flex-col w-full max-w-xl pt-32 px-5 pb-5">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center space-x-3">
            <h1 className="text-2xl underline underline-offset-4">
              {formattedDate}
            </h1>
            {!savedComment && !showCommentBox && (
              <button onClick={() => setShowCommentBox(true)}>
                <FontAwesomeIcon
                  icon={faComment}
                  className="text-xl hover:text-green-600 ease-in-out duration-300"
                />
              </button>
            )}
            {showCommentBox && (
              <CommentBox
                onClose={() => setShowCommentBox(false)}
                onSave={handleSaveComment}
                onDelete={handleDeleteComment}
              />
            )}
            {savedComment && !showCommentBox && (
              <div
                className="border rounded-full px-3 py-2 bg-gray-100 text-gray-800 cursor-pointer"
                onClick={() => setShowCommentBox(true)}
              >
                {savedComment}
              </div>
            )}
          </div>

          <div>
            <button
              className="border rounded-full mx-0 w-full px-4 py-2 my-2 text-md hover:bg-gray-200 duration-300 ease-in-out"
              onClick={handleLogWorkout}
            >
              log
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {selectedTags.map((tag, index) => (
            <span
              key={`${index}-${tag}`}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
          <button
            className="border rounded-full w-10 px-2 hover:bg-gray-200 duration-300 ease-in-out focus:bg-gray-200"
            onClick={() => setShowTagFilter(true)}
          >
            +
          </button>
        </div>

        {showTagFilter && (
          <TagFilter
            onClose={() => setShowTagFilter(false)}
            onTagSelect={handleTagSelect}
          />
        )}

        <div className="mt-4">
          {movements.map((id) => (
            <MovementComponent key={id} id={id} />
          ))}
        </div>
        <button
          className="border rounded-full flex items-center justify-center mx-auto w-40 px-2 my-4 hover:bg-gray-200 duration-300 ease-in-out"
          onMouseDown={(e) => {
            e.preventDefault(); // Prevents the default focus change behavior
            e.stopPropagation(); // Stops the event from bubbling
            // Optionally, force blur of the active element
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }
            // Immediately add the movement
            addMovement();
          }}
        >
          add movement
        </button>
      </div>
      {/* todo, DON'T TOUCH! */}
      <div className="absolute right-20 top-20 flex flex-col text-purple-400">
        <h1 className="underline">todo</h1>
        <ol className="pl-4">
          <li>same date api handling</li>
          <li>fix database col / row parameters</li>
          <li>change tags so that its string? and not array</li>
          <li>
            allow to find pr's (n movement, k sets = n pr sets) PER workout
          </li>
          <li>dropsets</li>
        </ol>
      </div>
    </div>
  );
}
