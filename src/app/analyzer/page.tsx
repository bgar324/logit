"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
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
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

interface Exercise {
  id: number;
  name: string;
  lastLogged?: string | null;
}

interface PRRecord {
  id: string;
  exerciseName: string;
  bestWeight: number;
  bestReps: number;
  workoutDate: string;
}

interface GroupedExercises {
  recent24: Exercise[];
  threeDays: Exercise[];
  sevenPlus: Exercise[];
}

export default function ProgressionPage() {
  const [groupedExercises, setGroupedExercises] = useState<GroupedExercises>({
    recent24: [],
    threeDays: [],
    sevenPlus: [],
  });
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [prData, setPrData] = useState<PRRecord[]>([]);

  const [collapsed, setCollapsed] = useState({
    recent24: false,
    threeDays: false,
    sevenPlus: false,
  });

  const toggleSection = (section: keyof typeof collapsed) => {
    setCollapsed((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    fetch("/api/exercises/all")
      .then((res) => res.json())
      .then((data) => {
        const exList = data.exercises as Exercise[];
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;
        const threeDaysMs = 3 * oneDayMs;

        const recent24: Exercise[] = [];
        const threeDays: Exercise[] = [];
        const sevenPlus: Exercise[] = [];

        exList.forEach((ex) => {
          if (!ex.lastLogged) {
            sevenPlus.push(ex);
            return;
          }
          const diff = now - new Date(ex.lastLogged).getTime();

          if (diff < oneDayMs) {
            recent24.push(ex);
          } else if (diff < threeDaysMs) {
            threeDays.push(ex);
          } else {
            sevenPlus.push(ex);
          }
        });

        setGroupedExercises({ recent24, threeDays, sevenPlus });
      })
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

  const renderExerciseItem = (ex: Exercise) => (
    <li
      key={ex.id}
      className={`rounded-md hover:bg-highlightColor ease-in-out duration-300 cursor-pointer my-2 p-2 ${
        selectedExercise && selectedExercise.id === ex.id
          ? "bg-highlightColor"
          : ""
      }`}
      onClick={() => setSelectedExercise(ex)}
    >
      {ex.name}
    </li>
  );

  return (
    <div className="flex">
      <div className="w-1/5 border-r px-4 h-screen overflow-y-auto text-xs sm:text-sm md:text-base">
        <div className="flex flex-row gap-3 sticky bg-baseBg z-50 top-0 w-auto py-4 border-b">
          <a
            href="/"
            className="text-slate-500 hover:text-black duration-300 ease-in-out pt-[0.5px]"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </a>
          <h3 className="font-semibold">exercises</h3>
        </div>

        <div className="mt-4 ml-2">
          <div
            className="flex flex-row items-center gap-2 cursor-pointer"
            onClick={() => toggleSection("recent24")}
          >
            {/* Toggle icon changes depending on collapsed state */}
            <FontAwesomeIcon
              icon={collapsed.recent24 ? faAngleRight : faAngleDown}
            />
            <h4 className="text-sm font-semibold text-gray-600">
              past 24 hours
            </h4>
            <hr className="flex-grow border-t border-gray-300" />
          </div>
          {!collapsed.recent24 && (
            <ul>{groupedExercises.recent24.map(renderExerciseItem)}</ul>
          )}
        </div>

        {/* 3+ Days */}
        <div className="mt-4 ml-2">
          <div
            className="flex flex-row items-center gap-2 cursor-pointer"
            onClick={() => toggleSection("threeDays")}
          >
            <FontAwesomeIcon
              icon={collapsed.threeDays ? faAngleRight : faAngleDown}
            />
            <h4 className="text-sm font-semibold text-gray-600">3+ days</h4>
            <hr className="flex-grow border-t border-gray-300" />
          </div>
          {!collapsed.threeDays && (
            <ul>{groupedExercises.threeDays.map(renderExerciseItem)}</ul>
          )}
        </div>

        {/* 7+ Days */}
        <div className="mt-4 ml-2">
          <div
            className="flex flex-row items-center gap-2 cursor-pointer"
            onClick={() => toggleSection("sevenPlus")}
          >
            <FontAwesomeIcon
              icon={collapsed.sevenPlus ? faAngleRight : faAngleDown}
            />
            <h4 className="text-sm font-semibold text-gray-600">7+ days</h4>
            <hr className="flex-grow border-t border-gray-300" />
          </div>
          {!collapsed.sevenPlus && (
            <ul>{groupedExercises.sevenPlus.map(renderExerciseItem)}</ul>
          )}
        </div>

        <ul className="list-none p-0 ml-4">
          {exercises.map((ex) => (
            <li
              key={ex.id}
              className={`rounded-md hover:bg-highlightColor ease-in-out duration-300 cursor-pointer my-2 p-2 w-t ${
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
            <h3 className="p-4">
              <span className="font-medium underline underline-offset-4">
                {selectedExercise.name}'s
              </span>{" "}
              progressive overload
            </h3>
            {prData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={prData}>
                  <defs>
                    <linearGradient
                      id="colorWeight"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid stroke="#ccc" />
                  <XAxis
                    dataKey="workoutDate"
                    tickFormatter={(dateStr) =>
                      new Date(dateStr).toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                      })
                    }
                    tick={{ dy: 10 }}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={() => ""}
                    formatter={(value: any, name: any, props: any) => {
                      const repCount = props.payload.bestReps;
                      return [
                        <div key="tooltip-content" className="text-center">
                          <div>
                            <span className="underline underline-offset-2">
                              weight
                            </span>
                            : {value}
                          </div>
                          <div>
                            <span className="underline underline-offset-2">
                              reps
                            </span>
                            : {repCount}
                          </div>
                        </div>,
                      ];
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="bestWeight"
                    stroke="#8884d8"
                    fill="url(#colorWeight)"
                    dot={{ r: 3, fill: "#524f85" }}
                  />
                </AreaChart>
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
