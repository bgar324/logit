"use client";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { useRouter } from "next/navigation";
import "react-calendar/dist/Calendar.css";
import "./globals.css";
import Todo from "./Todo";

export default function Home() {
  const [value, setValue] = useState<Date | null>(new Date());
  const [loggedDates, setLoggedDates] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/all-logged-dates")
      .then((res) => res.json())
      .then((data) => setLoggedDates(data.dates)) 
      .catch((err) => console.error("Error fetching logged dates:", err));
  }, []);

  const handleDateChange = (
    dateValue: Date | Date[] | null
  ) => {
    if (dateValue instanceof Date) {
      setValue(dateValue);

      const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
      })
        .format(dateValue)
        .toLowerCase();

      router.push(`/log?date=${encodeURIComponent(formattedDate)}`);
      console.log(formattedDate);
    }
  };

  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
  })
    .format(today)
    .toLowerCase();

  const logRoute = `/log?date=${encodeURIComponent(formattedDate)}`;

  return (
    <div className="font-[family-name:var(--font-geist-sans)] flex flex-col h-screen justify-center items-center">
      <div className="flex justify-center items-center gap-16 flex-col">
        <div>
          <Calendar
            value={value}
            onChange={(value) => handleDateChange(value as Date | Date[] | null)}
            showNeighboringMonth={false}
            calendarType={"gregory"}
            tileClassName={({ date, view }) => {
              if (view === "month") {
                const dateString = date.toISOString().split("T")[0];
                if (loggedDates.includes(dateString)) {
                  return "react-calendar__tile--logged";
                }
              }
              return null;
            }}
          />
        </div>

        <div className="flex flex-row gap-3 mx-0 justify-center items-center -mt-10">
          <a
            href={logRoute}
            className="justify-center items-center w-auto flex border-2 border-[#a1a196] rounded-xl px-2 py-1 hover:bg-highlightColor duration-300 ease-in-out"
          >
            <span>log {formattedDate}</span>
          </a>

          <a
            href="/analyzer"
            className="justify-center items-center w-auto flex border-2 border-[#a1a196] rounded-xl px-2 py-1 hover:bg-highlightColor duration-300 ease-in-out"
          >
            <span>analyze</span>
          </a>
        </div>
      </div>
      <Todo />
    </div>
  );
}
