"use client";

import { useState, type FormEvent } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useCountdown } from "../../hooks/useCountdown";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";

export const SignUpOTPForm = () => {
    const [code, setCode] = useState("");
    const nav = useRouter();
    const { secondsLeft, startTimer } = useCountdown(60);


    return (
        <form
            id="otp-form"
            onSubmit={(e) => console.log('otp!')}
            className="flex flex-col items-center gap-6 bg-transparent text-center text-neutral-100"
        >

            <div className="space-y-2">
                <h1 className="text-2xl font-semibold">Verify your email</h1>
                <p className="text-sm">
                    Welcome to FirePatch! We sent a 6-digit code to your email to finish
                    creating your account.
                </p>
                <p className="text-sm">This code will expire in 5 minutes.</p>
            </div>

            <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={code}
                onChange={setCode}
            >
                <InputOTPGroup className="bg-transparent text-neutral-100">
                    <InputOTPSlot index={0} className="bg-transparent text-neutral-100" />
                    <InputOTPSlot index={1} className="bg-transparent text-neutral-100" />
                    <InputOTPSlot index={2} className="bg-transparent text-neutral-100" />
                    <InputOTPSlot index={3} className="bg-transparent text-neutral-100" />
                    <InputOTPSlot index={4} className="bg-transparent text-neutral-100" />
                    <InputOTPSlot index={5} className="bg-transparent text-neutral-100" />
                </InputOTPGroup>
            </InputOTP>

            <Button form="otp-form" type="submit" variant="default" disabled={code.length !== 6}>
                Verify and create account
            </Button>

            <p className="text-sm">
                Didn&apos;t get the code?{" "}
                {secondsLeft > 0 ? (
                    <span>Resend in {secondsLeft}s</span>
                ) : (
                    <button
                        type="button"

                        className="underline underline-offset-4 hover:opacity-80"
                    >
                        Resend code
                    </button>
                )}
            </p>
        </form>
    );
}