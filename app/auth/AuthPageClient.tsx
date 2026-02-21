"use client"

import { useState } from "react"
import { SignIn } from "@/components/auth/sign-in"
import { SignUp } from "@/components/auth/sign-up"

export default function AuthPageClient() {
    const [view, setView] = useState<"sign-in" | "sign-up">("sign-in")

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                {view === "sign-in" ? (
                    <SignIn onSwitch={() => setView("sign-up")} />
                ) : (
                    <SignUp onSwitch={() => setView("sign-in")} />
                )}
            </div>
        </div>
    )
}
