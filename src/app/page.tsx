"use client";
import RoundedBox from "./components/RoundedBox";
import React, { useState } from "react";
import Calendar from "react-calendar";
import Spinner from "./log/components/Spinner";
import { useRouter } from "next/navigation";
import "react-calendar/dist/Calendar.css";
import "./globals.css";

export default function Home() {
  const [value, setValue] = useState<Date | null>(new Date());
  const router = useRouter();

  const handleDateChange = (
    dateValue: Date | Date[] | null,
    event: React.MouseEvent<HTMLButtonElement> | undefined
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
            // i have no idea why this works but it does
            onChange={handleDateChange}
            selectRange={false}
            showNeighboringMonth={false}
            calendarType={"gregory"}
          />
        </div>

        <div className="flex flex-row gap-3 mx-0 justify-center items-center -mt-10">
          <a
            href={logRoute}
            className="justify-center items-center w-auto flex border-2 rounded-xl px-2 py-1 hover:bg-highlightColor duration-300 ease-in-out"
          >
            <span>log {formattedDate}</span>
          </a>

          <a
            href="/analyzer"
            className="justify-center items-center w-auto flex border-2 rounded-xl px-2 py-1 hover:bg-highlightColor duration-300 ease-in-out"
          >
            <span>analyze</span>
          </a>
        </div>
      </div>
    </div>
  );
}
