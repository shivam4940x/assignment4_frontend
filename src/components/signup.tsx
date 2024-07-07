"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import resource from "../resource.json";
import { sleep } from "@/app/utility/miniModules";
import { useRouter } from "next/navigation";
export default function Signup() {
  const router = useRouter();
  const [username, setusername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [success, setsuccess] = useState<boolean>(false);
  const [gotError, setgotError] = useState<boolean>(false);
  const [errorMessage, seterrorMessage] = useState<string>("");
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setusername(e.target.value);
  };
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
 
    try {
      const response = await fetch(`${resource.server}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            username: username,
            password: password,
          },
        }),
      });
      if (!response.ok || !response) {
        setgotError(true);
        seterrorMessage("No response from server, Try again later");
        await sleep(3000);
        setgotError(false);
        seterrorMessage("");
        throw Error("Server dead");
      } else {
        const data = await response.json();
        if (!data.token) {
          setgotError(true);
          seterrorMessage(data.errorMsg);
          await sleep(3000);
          setgotError(false);
          return;
        }
        const AccessToken = data.token.ACCESS_TOKEN;
        if (AccessToken) {
          setsuccess(true);
          await sleep(1000);
          localStorage.setItem("access_token", JSON.stringify(AccessToken));
          router.push("/");
        }
      }
    } catch (e) {
      setgotError(true);
      seterrorMessage("No response from server, Try again later");
      await sleep(3000);
      setgotError(false);
      seterrorMessage("");
      console.error("error:", e);
    }
  }
  return (
    <div className="flex justify-center items-center w-screen h-screen selection:bg-white selection:text-black">
      {gotError && (
        <div className="absolute z-10 top-0 left-0">
          <div
            className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
            role="alert"
          >
            <svg
              className="flex-shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">{errorMessage}!</span>
            </div>
          </div>
        </div>
      )}
      {success && (
        <div className=" absolute top-0 left-0">
          <div
            className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
            role="alert"
          >
            <svg
              className="flex-shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">Login successful</span>
            </div>
          </div>
        </div>
      )}
      <div className="relative mx-auto w-full max-w-md bg-black border border-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
        <div className="w-full">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-white">Sign Up</h1>
            <p className="mt-2 text-gray-500">
              Sign Up below to create a new account
            </p>
          </div>
          <div className="mt-5">
            <form action="" onSubmit={handleSubmit} autoComplete="false">
              <div className="relative mt-6">
                <input
                  type="username"
                  name="username"
                  id="username"
                  onChange={handleUsernameChange}
                  placeholder="Unique Username"
                  className="peer mt-1 w-full  bg-black border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                  autoComplete="false"
                />
                <label
                  htmlFor="username"
                  className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-white"
                >
                  Username
                </label>
              </div>
              <div className="relative mt-6">
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={handlePasswordChange}
                  placeholder="Password"
                  className="peer peer mt-1 w-full border-b-2 bg-black border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                />
                <label
                  htmlFor="password"
                  className="pointer-events-none  absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-white"
                >
                  Password
                </label>
              </div>
              <div className="my-6">
                <button
                  type="submit"
                  className=" custom-animation-button w-full rounded-md bg-black px-3 py-4 text-white focus:bg-gray-600 focus:outline-none border border-white"
                >
                  Sign Up
                </button>
              </div>
              <p className="text-center text-sm text-gray-500">
                Already have an account? Here go&nbsp;
                <Link
                  href="/signin"
                  className="font-semibold text-gray-600 hover:underline focus:text-gray-800 focus:outline-none "
                >
                  Sign In
                </Link>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
