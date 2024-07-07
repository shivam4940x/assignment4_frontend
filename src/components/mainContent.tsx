"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import List from "@/components/list";
import resource from "../resource.json";
export default function MainContent() {
  interface ListItems {
    index: number;
    title: string;
    task: string;
    id: number;
    addedAt: Date;
  }
  const [taskInput, setTaskInput] = useState<string>("");
  const [taskTitle, settaskTitle] = useState<string>("");
  const [user, setuser] = useState<string>("");
  const [isUserLogin, setisUserLogin] = useState<boolean>(false);
  const [userTaskList, setuserTaskList] = useState<ListItems[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const handleTaskTitle = (event: ChangeEvent<HTMLInputElement>) => {
    settaskTitle(event.target.value);
  };
  const handleTaskDesc = (event: ChangeEvent<HTMLInputElement>) => {
    setTaskInput(event.target.value);
  };
  const showMoreBtn = () => {
    setIsRotated(!isRotated);
    setIsOpen(!isOpen);
  };
  const addTaskHandler = async () => {
    if (!isUserLogin) {
      const JsonList = localStorage.getItem("userTask");
      if (!JsonList) {
        const data = [
          {
            title: taskTitle,
            task: taskInput,
            addedAt: new Date().toISOString(),
          },
        ];
        localStorage.setItem("userTask", JSON.stringify(data));
      } else {
        const TaskList = JSON.parse(JsonList);
        TaskList.push({
          title: taskTitle,
          task: taskInput,
          addedAt: new Date().toISOString(),
        });
        localStorage.setItem("userTask", JSON.stringify(TaskList));
      }
    } else {
      const data = {
        title: taskTitle,
        task: taskInput,
        addedAt: new Date().toISOString(),
      };
      const Jsontoken = localStorage.getItem("access_token");
      if (!Jsontoken) return;
      const token = JSON.parse(Jsontoken);
      if (!token) return;
      try {
        const response = await fetch(`${resource.server}/list`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data,
          }),
        });
        if (!response.ok || !response) {
          throw Error("Server dead");
        }
      } catch (err) {
        console.error("error adding task:", err);
      }
    }
    setTaskInput("");
    settaskTitle("");
    initList();
  };
  const initList = async () => {
    const Jsontoken = localStorage.getItem("access_token");
    if (Jsontoken) {
      setisUserLogin(true);
      const token = JSON.parse(Jsontoken);
      const response = await fetch(`${resource.server}/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok || !response) {
        throw Error("Server dead");
      }
      const data = await response.json();
      if (data.list) {
        setuser(data.userData.name);
        setuserTaskList(data.list);
      }
    } else {
      const JsonList = localStorage.getItem("userTask");
      if (!JsonList) return;
      const TaskList = JSON.parse(JsonList);
      setuserTaskList(TaskList);
    }
  };
  const handleSignout = () => {
    setisUserLogin(false);
    localStorage.removeItem("access_token");
    initList();
  };
  useEffect(() => {
    const initList = async () => {
      const Jsontoken = localStorage.getItem("access_token");
      if (Jsontoken) {
        const token = JSON.parse(Jsontoken);
        const response = await fetch(`${resource.server}/list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok || !response) {
          throw Error("Server dead");
        }
        const data = await response.json();
        if (data.list) {
          setisUserLogin(true);
          setuser(data.userData.name);
          setuserTaskList(data.list);
        }
      } else {
        const JsonList = localStorage.getItem("userTask");
        if (!JsonList) return;
        const TaskList = JSON.parse(JsonList);
        setuserTaskList(TaskList);
      }
    };
    initList();
  }, []);
  return (
    <main className="min-h-72 w-700 h-fit m-auto mt-8  container selection:bg-white selection:text-black">
      {isUserLogin && (
        <div className="absolute top-0 right-0" onClick={handleSignout}>
          <button className="border border-white w-40 p-2 cursor-pointer custom-animation-button relative z-0">
            Sign out
          </button>
        </div>
      )}
      <h1 className="text-white font-bold text-2xl text-center mb-4">
        To Do List{" "}
        {isUserLogin ? <span className="font-light">of {user}</span> : null}
      </h1>

      <div className="contianer flex justify-center content-center min-h-12 h-fit relative mt-4 mb-4">
        <button
          id="add"
          className={`bg-white w-12 transition-all rounded-full h-12 p-1 absolute left-2/4 z-10 -translate-x-2/4 top-0 flex items-center justify-center transform ${
            isRotated ? "rotate-135" : ""
          }`}
          onClick={showMoreBtn}
        >
          <svg
            className="h-5 w-5"
            fill="#000000"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="800px"
            height="800px"
            viewBox="0 0 45.402 45.402"
            xmlSpace="preserve"
          >
            <g>
              <path
                d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141
		c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27
		c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435
		c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"
              />
            </g>
          </svg>
        </button>
      </div>
      <div
        className={`${
          isOpen ? "max-h-fit py-4" : "max-h-0 p-0"
        } overflow-hidden ease-linear`}
      >
        <div className="bg-black flex flex-col justify-between px-8 w-11/12">
          <div className="my-2 flex justify-center items-center">
            <label htmlFor="heading" className="mr-3 tracking-wide">
              Titile:
            </label>
            <input
              type="text"
              placeholder="Add Title"
              value={taskTitle}
              className="p-2 placeholder:p-2 border flex-grow border-white text-white bg-black focus:outline-none"
              onChange={handleTaskTitle}
              required
            />
          </div>
          <div className="my-2 flex justify-center items-center">
            <label htmlFor="description" className="mr-4 tracking-wide">
              Task:
            </label>
            <input
              type="text"
              required
              placeholder="Add Description"
              onChange={handleTaskDesc}
              className="p-2 placeholder:p-2 flex-grow border border-white text-white bg-black focus:outline-none"
              value={taskInput}
            />
          </div>
          <div className="flex my-2 w-full justify-end">
            <button
              className="border border-white w-40 p-2 cursor-pointer custom-animation-button relative z-0"
              onClick={addTaskHandler}
            >
              Add Task
            </button>
          </div>
        </div>
      </div>

      <ul className="w-full max-w-700 h-fit">
        {userTaskList.map((task, index: number) => (
          <List
            key={index}
            index={index}
            uniqueID={task.id}
            title={task.title}
            task={task.task}
            addedAt={task.addedAt}
            setlist={setuserTaskList}
          />
        ))}
      </ul>
      {!isUserLogin && (
        <p className="my-3">
          <strong>Notice:&nbsp;</strong>
          Your tasks are being stored locally. To access your tasks anywhere,
          please{" "}
          <Link href={"/signin"} className="underline">
            signin
          </Link>
          , or{" "}
          <Link href={"/signup"} className="underline">
            create a new account for free
          </Link>
          .
        </p>
      )}
    </main>
  );
}
