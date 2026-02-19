"use client";
import { useEffect, useState } from "react";
import { getCalendarDays } from "../utils/getCalendarDays";

const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export function Calendar({ onChange }) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDay, setSelectedDay] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = getCalendarDays(year, month);

  const monthLabel = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const isSameMonth =
      year === today.getFullYear() && month === today.getMonth();

    if (isSameMonth) {
      setSelectedDay(today.getDate());
      onChange?.(today);
    } else {
      setSelectedDay(1);
      onChange?.(new Date(year, month, 1));
    }
  }, [month, year]);

  const handleDateClick = (day) => {
    setSelectedDay(day);
    onChange?.(new Date(year, month, day));
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Booking Schedule</h2>

        <div className="flex items-center gap-3 text-sm font-medium">
          <button
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            className="text-gray-500 hover:text-black"
          >
            «
          </button>
          <span className="text-lg font-semibold">{monthLabel}</span>
          <button
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            className="text-gray-500 hover:text-black"
          >
            »
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500">
        {weekDays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-7 gap-y-4 text-center">
        {days.map((item, index) => {
          const isActive = selectedDay === item.day && !item.muted;

          return (
            <button
              key={index}
              disabled={item.muted}
              onClick={() => handleDateClick(item.day)}
              className={`
                relative mx-auto flex h-12 w-12 items-center justify-center rounded-xl text-sm font-medium
                transition
                ${
                  item.muted
                    ? "text-gray-300 cursor-default"
                    : "text-black hover:bg-gray-100"
                }
                ${isActive ? "bg-red-500 text-white hover:bg-red-500" : ""}
              `}
            >
              {item.day}

              {isActive && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-orange-300 border-2 border-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
