"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "tailwindcss/tailwind.css";
import MovementComponent from "./components/MovementComponent";
import TagFilter from "./components/TagFilter";
import CommentBox from "./components/CommentBox";
import Spinner from "./components/Spinner";

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

type WorkoutData = {
  formattedDate: string;
  notes: string; 
  tag: string;
  movements: MovementData[];
};

export default function LogPage() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date"); 

  const today = new Date();
  const defaultDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
  })
    .format(today)
    .toLowerCase();

  const [workoutData, setWorkoutData] = useState<WorkoutData>({
    formattedDate: dateParam ?? defaultDate,
    notes: "",
    tag: "",
    movements: [
      {
        id: crypto.randomUUID(),
        name: "",
        sets: [
          { weight: 0, reps: 0, setNumber: 1 },
        ],
      },
    ],
  });

  const [showTagFilter, setShowTagFilter] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [logButtonText, setLogButtonText] = useState("log");
  const [isLogging, setIsLogging] = useState(false);
  const [isLoading, setIsLoading] = useState(!!dateParam);

  useEffect(() => {
    if (!dateParam) return;

    setIsLoading(true);

    (async () => {
      try {
        const res = await fetch(
          `/api/workout?formattedDate=${encodeURIComponent(dateParam)}`
        );
        if (res.ok) {
          const { workout } = await res.json();
          if (workout) {
            const updatedMovements = workout.movements.map((mov: any) => {
              const allSets = [...mov.sets, ...mov.dropsets].sort(
                (a: any, b: any) => a.setNumber - b.setNumber
              );
              return {
                id: mov.id,
                name: mov.name,
                sets: allSets,
              };
            });

            setWorkoutData({
              formattedDate: workout.formattedDate,
              notes: workout.notes ?? "",
              tag: workout.tags ?? "",
              movements: updatedMovements,
            });
          }
        }
      } catch (err) {
        console.error("Error fetching workout:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [dateParam]);

  const addMovement = () => {
    setWorkoutData((prev) => ({
      ...prev,
      movements: [
        ...prev.movements,
        {
          id: crypto.randomUUID(),
          name: "",
          sets: [{ weight: 0, reps: 0, setNumber: 1 }],
        },
      ],
    }));
  };

  const updateMovement = (index: number, updatedMov: MovementData) => {
    const newMovements = [...workoutData.movements];
    newMovements[index] = updatedMov;
    setWorkoutData({ ...workoutData, movements: newMovements });
  };

  const deleteMovement = (index: number) => {
    if (workoutData.movements.length <= 1) return;
    setWorkoutData((prev) => ({
      ...prev,
      movements: prev.movements.filter((_, i) => i !== index),
    }));
  };

  const handleTagSelect = (tag: string) => {
    setWorkoutData((prev) => ({ ...prev, tag }));
    setShowTagFilter(false);
  };

  const handleSaveComment = (comment: string) => {
    if (comment.trim()) {
      setWorkoutData((prev) => ({ ...prev, notes: comment }));
      setShowCommentBox(false);
    }
  };

  const handleDeleteComment = () => {
    setWorkoutData((prev) => ({ ...prev, notes: "" }));
    setShowCommentBox(false);
  };

  const handleLogWorkout = async () => {
    if (isLogging) return;
    setIsLogging(true);
    setLogButtonText("logging...");
    try {
      const movementsToSend = workoutData.movements.map((mov) => ({
        name: mov.name,
        sets: mov.sets.map((s) => ({
          weight: s.weight,
          reps: s.reps,
          setNumber: s.setNumber,
        })),
      }));

      const payload = {
        formattedDate: workoutData.formattedDate,
        notes: workoutData.notes,
        tag: workoutData.tag,
        movements: movementsToSend,
      };

      const response = await fetch("/api/log-workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setLogButtonText("logged!");
      } else {
        console.error("Failed to log workout");
        setLogButtonText("log ❌");
      }
    } catch (error) {
      console.error("Error logging workout:", error);
      setLogButtonText("log ❌");
    } finally {
      setIsLogging(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen flex justify-center">
      <div className="flex flex-col w-full max-w-xl pt-5 sm:pt-16 md:pt-32 px-5 pb-5">
        <a
          href="/"
          className="text-slate-500 hover:text-black duration-300 ease-in-out text-xs sm:text-sm md:text-base"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </a>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center space-x-3">
            <h1 className="text-lg sm:text-xl md:text-2xl underline underline-offset-4">
              {workoutData.formattedDate}
            </h1>

            {!workoutData.notes && !showCommentBox && (
              <button
                onClick={() => setShowCommentBox(true)}
                className="outline-none"
              >
                <FontAwesomeIcon
                  icon={faComment}
                  className="text-base sm:text-lg md:text-xl hover:text-green-600 ease-in-out duration-300"
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
            {workoutData.notes && !showCommentBox && (
              <div
                className="border rounded-full px-3 py-2 bg-gray-100 text-gray-800 cursor-pointer"
                onClick={() => setShowCommentBox(true)}
              >
                {workoutData.notes}
              </div>
            )}
          </div>

          <div>
            <button
              className={`border rounded-full mx-0 w-full px-4 py-2 my-2 text-sm md:text-base duration-300 ease-in-out outline-none
                ${
                  isLogging
                    ? "bg-gray-300 cursor-not-allowed"
                    : "hover:bg-green-200"
                }`}
              onClick={handleLogWorkout}
              disabled={isLogging}
            >
              {logButtonText}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {workoutData.tag ? (
            <span
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs md:text-sm cursor-pointer"
              onClick={() => setShowTagFilter(true)}
            >
              {workoutData.tag}
            </span>
          ) : (
            <button
              className="text-xs md:text-sm border rounded-full w-10 px-2 hover:bg-gray-200 duration-300 ease-in-out focus:bg-gray-200 outline-none"
              onClick={() => setShowTagFilter(true)}
            >
              +
            </button>
          )}
        </div>
        {showTagFilter && (
          <TagFilter
            onClose={() => setShowTagFilter(false)}
            onTagSelect={handleTagSelect}
          />
        )}

        <div className="mt-4">
          {workoutData.movements.map((movement, index) => (
            <MovementComponent
              key={movement.id}
              movement={movement}
              onChange={(updated) => updateMovement(index, updated)}
              onDelete={() => deleteMovement(index)}
            />
          ))}
        </div>

        <button
          className="border rounded-full flex items-center justify-center mx-auto w-40 px-2 my-4 hover:bg-gray-200 duration-300 ease-in-out text-sm md:text-base outline-none"
          onMouseDown={(e) => {
            e.preventDefault();
            addMovement();
          }}
        >
          add movement
        </button>
      </div>
      {/* <div className="absolute right-20 top-20 flex flex-col text-purple-400">
        <h1 className="underline">todo</h1>
        <ol className="pl-4">
          <li>
            allow to find pr's (n movement, k sets = n pr sets) PER workout
          </li>
          <li>fix issue where loading a page loads a duplicate of the movement but in a dropdown</li>
          <li>work on responsiveness</li>
        </ol>
      </div> */}
    </div>
  );
}
