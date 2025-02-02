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

  const addMovement = () => {
    setMovements((prev) => [...prev, prev.length]);
  };

  const [showTagFilter, setShowTagFilter] = useState(false);
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

  return (
    <div className="flex flex-col justify-center pt-32 mx-96 pb-5">
      {/* Date and Comment Icon on the same line */}
      <div className="flex flex-row items-center space-x-3">
        <h1 className="text-2xl underline underline-offset-4">
          {formattedDate}
        </h1>

        {/* Show Comment Icon if no comment exists and input is closed */}
        {!savedComment && !showCommentBox && (
          <button onClick={() => setShowCommentBox(true)}>
            <FontAwesomeIcon
              icon={faComment}
              className="text-xl hover:text-green-600 ease-in-out duration-300"
            />
          </button>
        )}

        {/* Show CommentBox when input is open */}
        {showCommentBox && (
          <CommentBox
            onClose={() => setShowCommentBox(false)}
            onSave={handleSaveComment}
            onDelete={handleDeleteComment}
          />
        )}

        {/* Show saved comment if it exists */}
        {savedComment && !showCommentBox && (
          <div
            className="border rounded-full px-3 py-2 bg-gray-100 text-gray-800 cursor-pointer"
            onClick={() => setShowCommentBox(true)}
          >
            {savedComment}
          </div>
        )}
      </div>

      {/* Plus Button (Appears Below the Date & Comment) */}
      <button
        className="border rounded-full w-10 px-2 mt-4 hover:bg-gray-200 duration-300 ease-in-out"
        onClick={() => setShowTagFilter(true)}
      >
        +
      </button>
      {showTagFilter && <TagFilter onClose={() => setShowTagFilter(false)} />}

      {/* Movement Components Below */}
      <div className="mt-4">
        {movements.map((id) => (
          <MovementComponent key={id} />
        ))}
      </div>

      {/* Add Movement Button Below */}
      <button
        className="border rounded-full flex items-center justify-center mx-0 w-40 px-2 my-4 hover:bg-gray-200 duration-300 ease-in-out"
        onClick={addMovement}
      >
        add movement
      </button>
    </div>
  );
}
