"use client"

import { Controller } from "react-hook-form"


import { Input } from "@/components/ui/input"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { Marker, MarkerContent } from "@/components/ui/marker"
import { useAuthForm } from "@/features/auth/hooks/useAuthForm"
import { signUpFormSchema, type AuthForm } from "@/features/auth/schemas"
import Link from "next/link"
import { FirePatchLockUp } from "@/components/ui/FirePatchLockUp"
import { api } from "@/lib/axios"
import { useMutation } from "@tanstack/react-query"
import { SignUpOTPForm } from "@/features/auth/components/molecules/SignUpOTPForm"
import type { OTPVerificationResponse, SendSignupOtpResponse } from "@/features/auth/auth.types"
import { toast, Toaster } from "sonner"


const SignUp = () => {

    const form = useAuthForm(signUpFormSchema);

    const { mutate: onSubmit, data } = useMutation({
        mutationFn: async (values: AuthForm) => {
            const promise = api.post<SendSignupOtpResponse>('/api/v1/auth/signup/otp', values);
            toast.promise(promise, {
                loading: "Sending verification code...",
                success: "Verification code sent! Check your email.",
                error: "Failed to send verification code. Please try again.",
            });
            return (await promise).data;
        }
    })


    return (
        <div className="w-6/12 mx-auto z-200 h-full gap-6 text-neutral-900 dark:text-neutral-100 flex flex-col items-center justify-center">
            <FirePatchLockUp width={100} />
            {
                data?.success && data.nextStep === 'verify-otp' ? <SignUpOTPForm /> : <form
                    onSubmit={form.handleSubmit((values) => onSubmit(values))}
                    className="w-full max-w-md space-y-6"
                    noValidate
                >
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Email
                                </FieldLabel>


                                <Input
                                    {...field}
                                    id={field.name}
                                    type="email"
                                    placeholder="Your email address"
                                    autoComplete="email"
                                    aria-invalid={fieldState.invalid}
                                />
                                <FieldDescription>
                                    Enter a valid email address, e.g. name@example.com
                                </FieldDescription>
                                {
                                    fieldState.error?.message && (
                                        <FieldError>
                                            {fieldState.error?.message}
                                        </FieldError>
                                    )
                                }

                            </Field>
                        )}
                    />

                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Password
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="password"
                                    placeholder="Your password"
                                    autoComplete="new-password"
                                    aria-invalid={fieldState.invalid}
                                />

                                <FieldDescription>
                                    8–36 characters. Must contain letters (a–Z) and numbers (0–9).
                                </FieldDescription>
                                {
                                    fieldState.error?.message && (
                                        <FieldError>
                                            {fieldState.error?.message}
                                        </FieldError>
                                    )
                                }
                            </Field>
                        )}
                    />

                    <div className="flex flex-col items-center justify-center gap-2">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting
                                ? "Creating account..."
                                : "Create account"}
                        </Button>
                        <Marker className="my-2" variant={'separator'}>

                            <MarkerContent>Or continue with</MarkerContent>
                        </Marker>
                        <div className="flex gap-1 items-center w-full ">
                            <Button
                                type="submit"
                                variant={'outline'}
                                className="w-6/12 "
                                disabled={form.formState.isSubmitting}
                            >

                                <FcGoogle />  Google
                            </Button>
                            <Button
                                variant={'outline'}
                                type="submit"
                                className="w-6/12"
                                disabled={form.formState.isSubmitting}
                            >

                                <FaGithub />  GitHub
                            </Button>
                        </div>

                    </div>
                    <p className="mx-auto w-fit text-sm">
                        Already have an account? <Link href={'/signin'} className="font-medium underline" >Sign In</Link>
                    </p>

                </form>
            }
        </div>
    )
}

export default SignUp
