"use client";
import {StepForward} from "lucide-react";
import Image from "next/image";
import Link from "next/link";


import {SignUpButton, useUser} from "@clerk/clerk-react";

import {SignInButton} from "@clerk/nextjs";
import {useRouter} from "next/navigation";
import LogoIcon from "@/components/ui/logo-icon";
import React, {useEffect} from "react";

export default function LandingPage() {
    const { isSignedIn } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (isSignedIn) {
            router.push("/dashboard");
        }
    }, [isSignedIn, router]);

    return (
        <main className="bg-gradient-to-r from-black-200 to-blue-200 h-full min-h-screen">
            <div className="container relative m-0 mx-auto py-10 md:px-10">
                <div className="max-width flex items-center justify-center lg:justify-between">
                    <Link href="/" className="flex items-center flex-1 justify-center gap-2">
                        <LogoIcon/>
                        <h1 className="text-lg font-semibold">Pitch Perfect</h1>
                    </Link>

                    <div className="hidden lg:flex w-fit items-center">
                        <SignInBtn/>
                    </div>
                </div>
                <div className="w-full px-4 pt pt-12 md:px-4 lg:px-8 xl:px-10 2xl:px-0">
                    <div className="flex h-full w-full flex-col items-center justify-center">
                        <h1 className="inline-block text-center text-4xl font-medium tracking-tighter text-dark lg:text-7xl">
                            An AI-Powered{" "}
                            <br className="hidden lg:inline-block"/>
                            Startup Pitch Evaluation
                        </h1>
                        <h2 className="mt-8 text-center text-xl font-light tracking-tight lg:text-3xl">
                            Pitch Perfect{" "}
                            <span className="font-bold px-1">evaluates your pitches</span>
                            <br className="hidden lg:inline-block"/>
                            {/*<span className="font-bold px-1">predicts what&apos;s next</span>*/}
                            using AI.
                        </h2>
                        <div className="mt-12 flex flex-col gap-4">
                            <GetStartedButton/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="">
                <div className="flex items-center justify-center">
                    <Image
                        alt="mobile"
                        loading="lazy"
                        width="500"
                        height="600"
                        className="z-10 max-w-[400px]"
                        src="/mobile.png"
                    />
                    <Image
                        src="/desktop.png"
                        alt="laptop"
                        loading="lazy"
                        width="1000"
                        height="500"
                        data-nimg="1"
                        className="h-full -ml-28 mt-10 hidden lg:flex"
                    />
                </div>
            </div>
            <div className="flex items-center justify-center">
                <footer
                    className="bottom-0 container mx-auto my-5 flex flex-col items-center justify-between space-y-3 border-t space-x-4 px-3 pt-4 text-center sm:flex-row sm:pt-2 md:text-lg">
                    <div>
                        Powered by{" "}
                        <a
                            href="https://convex.dev/c/todovex"
                            target="_blank"
                            className="pr-1 font-bold transition hover:text-black/50"
                        >
                            Convex
                        </a>
                        and
                        <a
                            href="https://www.openai.com/"
                            target="_blank"
                            className="pl-1 font-bold transition hover:text-black/50"
                        >
                            OpenAI
                        </a>
                    </div>
                </footer>
            </div>
        </main>
    );
}

const GetStartedButton = () => {
    const {isSignedIn} = useUser()
    const router = useRouter();
    return (

        isSignedIn ? (

            <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center justify-center px-8 py-4 mb-2 me-2 overflow-hidden
                            text-xl font-medium text-gray-100 rounded-xl group bg-gradient-to-br from-purple-600
                            to-orange-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none
                            focus:ring-yellow-300 dark:focus:ring-blue-800">
                            <span className="flex items-center gap-1">
                                <>
                                 Get Started
                                <StepForward/>
                                   </>
                            </span>

            </button>

        ) : (
            <SignUpButton mode={"modal"}>
                <button
                    className="flex items-center justify-center px-8 py-4 mb-2 me-2 overflow-hidden
                            text-xl font-medium text-gray-100 rounded-xl group bg-gradient-to-br from-purple-600
                            to-orange-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none
                            focus:ring-yellow-300 dark:focus:ring-blue-800">
                            <span className="flex items-center gap-1">
                                <>
                                 Get Started
                                <StepForward/>
                                   </>
                            </span>

                </button>
            </SignUpButton>
        )

    )
}

const SignInBtn = () => {
    const {isSignedIn, user} = useUser()
    const router = useRouter();


    return (

        isSignedIn ? (
            <button
                onClick={() => router.push("/dashboard")}
                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden
                            text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600
                            group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                                <span
                                    className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                    <>
                                    Hi {user?.firstName}
                                       </>
                                </span>

            </button>
        ) : (
            <SignInButton mode={"modal"}>
                <button
                    className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden
                            text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600
                            group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                                <span
                                    className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                    <>
                                     Sign In
                                       </>
                                </span>

                </button>
            </SignInButton>
        )
    )
}

