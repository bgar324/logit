"use client";
import React, { useState } from "react";
import Calendar from "react-calendar";
import { useRouter } from "next/navigation";
import "react-calendar/dist/Calendar.css";

export default function CalendarPage() {
  const [value, setValue] = useState<Date | null>(new Date());
  const router = useRouter();

  const handleDateChange = (
    dateValue: Date | Date[] | null,
    event: React.MouseEvent<HTMLButtonElement> | undefined
  ) => {
    // Only handle single date
    if (dateValue instanceof Date) {
      setValue(dateValue);

      const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
      })
        .format(dateValue)
        .toLowerCase();

      router.push(`/log?date=${encodeURIComponent(formattedDate)}`);
      console.log(formattedDate)
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Calendar value={value} onChange={handleDateChange} selectRange={false} />
    </div>
  );
}
