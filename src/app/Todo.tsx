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
    "oauth",
    "allow to switch between weight vs reps, and weight vs date",
    "figure out what to do with tags",
    "allow searching on the side bar",
    "figure out how to deploy this on the phone",
    "convert to iphone app ??? ",
    "account center for oauth",
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
