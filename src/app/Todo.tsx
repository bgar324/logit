import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "tailwindcss/tailwind.css";

const Todo = () => {
  // const [isOpen, setOpen] = useState(false);

  const todos = [
    "order analyze sidebar date and recency",
    "calendar map tile highlights whether if there is a log",
    "oauth",
    "allow to switch between weight vs reps, and weight vs date"
  ];

  return (
    <div className = "flex flex-col justify-center">
      <span
        // onClick={() => setOpen(!isOpen)}
        className="cursor-pointer mt-3 hover:text-purple-400 duration-100 ease-in-out"
      >
        todo
      </span>
      {/* {isOpen && ( */}
        <ul className = "mt-1 text-left">
          {todos.map((task, index) =>
          <li key = {index} className = "flex items-center gap-2">
            <FontAwesomeIcon icon = {faAngleRight} />
            {task}
          </li>)}
        </ul>
      {/* )} */}
    </div>
  );
};

export default Todo;
