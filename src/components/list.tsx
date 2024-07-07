import React, { useState, useEffect } from "react";

import resource from "../resource.json";
interface ListItems {
  index: number;
  title: string;
  task: string;
  addedAt: Date;
  uniqueID: number;
  setlist?: Function;
}

export default function List({
  index,
  title,
  task,
  addedAt,
  setlist,
  uniqueID,
}: ListItems) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserLogin, setisUserLogin] = useState<boolean>(false);
  const time = new Date(addedAt);
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const handleDelete = async () => {
    const Jsontoken = localStorage.getItem("access_token");
    if (Jsontoken) {
      const token = JSON.parse(Jsontoken);
      const response = await fetch(`${resource.server}/list`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            taskId: uniqueID,
          },
        }),
      });
      if (!response.ok || !response) {
        throw Error("Server dead");
      }
      const data = await response.json();
      if (data.updatedList && setlist) {
        setlist(data.updatedList);
      }
    } else {
      const JsonList = localStorage.getItem("userTask");
      if (!JsonList) return;
      const TaskList: Array<ListItems> = JSON.parse(JsonList);
      const newList = TaskList.filter(
        (obj) => obj.addedAt !== TaskList[index].addedAt
      );
      localStorage.setItem("userTask", JSON.stringify(newList));
      if (setlist) {
        setlist(newList);
      }
    }
  };
  return (
    <li className="border border-white text-white rounded-e-lg transition-all relative w-full duration-200">
      <div className="flex border-b border-customLw hover:bg-customLg">
        <input
          type="checkbox"
          name="todo"
          id={`todo-${index}`}
          className="hidden peer"
          checked={isOpen}
          onChange={handleToggle}
        />
        <label
          htmlFor={`todo-${index}`}
          className="block flex-grow p-3 cursor-pointer text-lg font-medium rounded-e-lg capitalize"
        >
          {title}
        </label>
        <div className="p-3">
          <div
            className="mx-1 cursor-pointer"
            id="delete"
            onClick={handleDelete}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30"
              height="30"
              viewBox="0,0,256,256"
            >
              <g fill="#e33535">
                <g transform="scale(4,4)">
                  <path d="M28,6c-2.209,0 -4,1.791 -4,4v2h-0.40039l-13.59961,2v3h44v-3l-13.59961,-2h-0.40039v-2c0,-2.209 -1.791,-4 -4,-4zM28,10h8v2h-8zM12,19l2.70117,33.32227c0.168,2.077 1.90428,3.67773 3.98828,3.67773h26.62305c2.084,0 3.81733,-1.59878 3.98633,-3.67578l2.625,-32.32422zM20,26c1.105,0 2,0.895 2,2v23h-3l-1,-23c0,-1.105 0.895,-2 2,-2zM32,26c1.657,0 3,1.343 3,3v22h-6v-22c0,-1.657 1.343,-3 3,-3zM44,26c1.105,0 2,0.895 2,2l-1,23h-3v-23c0,-1.105 0.895,-2 2,-2z"></path>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
      <div
        className={`${
          isOpen ? "max-h-64 p-3 py-4 px-8 overflow-scroll" : "max-h-0 p-0"
        } overflow-hidden duration-200`}
      >
        <h1 className="text-base my-4 underline">
          <strong>Added At:&nbsp; </strong>
          {`${time.toLocaleTimeString()} On ${time.toLocaleDateString()}`}
        </h1>
        <p className="break-words">{task}</p>
      </div>
    </li>
  );
}
