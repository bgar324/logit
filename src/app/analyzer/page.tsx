"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "tailwindcss/tailwind.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Exercise {
  id: number;
  name: string;
}

interface PRRecord {
  id: string;
  exerciseName: string;
  bestWeight: number;
  bestReps: number;
  workoutDate: string;
}

export default function ProgressionPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [prData, setPrData] = useState<PRRecord[]>([]);

  useEffect(() => {
    fetch("/api/exercises/all")
      .then((res) => res.json())
      .then((data) => setExercises(data.exercises))
      .catch((err) => console.error("Error fetching exercises:", err));
  }, []);

  useEffect(() => {
    if (selectedExercise) {
      fetch(
        `/api/exercise-pr?exerciseName=${encodeURIComponent(
          selectedExercise.name
        )}`
      )
        .then((res) => res.json())
        .then((data) => setPrData(data.prRecords))
        .catch((err) => console.error("Error fetching PR records:", err));
    }
  }, [selectedExercise]);

  return (
    <div className="flex">
      <div className="w-1/5 border-r p-4 h-screen overflow-y-auto text-xs sm:text-sm md:text-base">
        <div className="flex flex-row gap-3">
          <a
            href="/"
            className="text-slate-500 hover:text-black duration-300 ease-in-out pt-[0.5px]"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </a>
          <h3 className="underline underline-offset-4">exercises</h3>
        </div>
        <ul className="list-none p-0 ml-4">
          {exercises.map((ex) => (
            <li
              key={ex.id}
              className={`rounded-md hover:bg-highlightColor ease-in-out duration-300 cursor-pointer my-2 p-2 w-fit ${
                selectedExercise && selectedExercise.id === ex.id
                  ? "bg-highlightColor"
                  : ""
              }`}
              onClick={() => setSelectedExercise(ex)}
            >
              {ex.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col justify-center items-center w-4/5 p-4 h-screen">
        {selectedExercise ? (
          <>
            <h3 className = "p-4">
              <span className="font-medium underline underline-offset-4">
                {selectedExercise.name}'s
              </span>{" "}
              progressive overload
            </h3>
            {prData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={prData}>
                  <CartesianGrid stroke="#ccc" />
                  <XAxis
                    dataKey="workoutDate"
                    tickFormatter={(dateStr) =>
                      new Date(dateStr).toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                      })
                    }
                    tick = {{ dy : 10}}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={() => ""}
                    formatter={(value: any, name: any, props: any) => {
                      const repCount = props.payload.bestReps;
                      return [
                        <div key="tooltip-content" className="text-center">
                          <div>
                            <span className = "underline underline-offset-2">weight</span>: {value}
                          </div>
                          <div>
                            <span className = "underline underline-offset-2">reps</span>: {repCount}
                          </div>
                        </div>,
                      ];
                    }}
                  />
                  <Line type="monotone" dataKey="bestWeight" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p>no PR data available for this exercise.</p>
            )}
          </>
        ) : (
          <p>please select an exercise from the sidebar</p>
        )}
      </div>
    </div>
  );
}
