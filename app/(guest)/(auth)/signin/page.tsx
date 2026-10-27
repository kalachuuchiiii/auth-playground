"use client"
import { Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { Marker, MarkerContent } from "@/components/ui/marker"
import { useAuthForm } from "@/features/auth/hooks/useAuthForm"
import { signInFormSchema, type AuthForm } from "@/features/auth/schemas"
import Link from "next/link"
import { FirePatchLockUp } from "@/components/ui/FirePatchLockUp"
import { useMutation } from "@tanstack/react-query"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


const SignIn = () => {
    const form = useAuthForm(signInFormSchema);
    const nav = useRouter();
    const { mutate: signMeIn, isPending } = useMutation({
        mutationFn: async ({ email, password }: AuthForm) => {
            const promise = signIn('credentials', {
                email,
                password,
                redirect: false
            }).then((result) => {
                if (!result || result.error) {
                    throw new Error("Invalid email or password.");
                }

                return result;
            });

            toast.promise(promise, {
                loading: "Signing in...",
                success: "Signed in successfully!",
                error: (error) => error.message ?? "Something went wrong. Please try again.",
            });
            const result = await promise;
            return result;
        },
        onSuccess: (result) => {
            if (result.ok) {
                nav.replace('/');
            }
        }
    })

    return (
        <div className="w-6/12 mx-auto gap-6 h-full text-neutral-900 dark:text-neutral-100 flex flex-col items-center justify-center">
            <FirePatchLockUp width={100} />
            <form
                id="signin-form"

                onSubmit={form.handleSubmit((values) => signMeIn(values))}
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
                                disabled={isPending}
                                {...field}
                                id={field.name}
                                type="email"
                                placeholder="Your email address"
                                autoComplete="email"
                                aria-invalid={fieldState.invalid}
                            />

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
                                disabled={isPending}
                                {...field}
                                id={field.name}
                                type="password"
                                placeholder="Your password"
                                autoComplete="new-password"
                                aria-invalid={fieldState.invalid}
                            />


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
                        form="signin-form"
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending
                            ? "Signing you in..."
                            : "Sign-in"}
                    </Button>
                    <Marker className="my-2" variant={'separator'}>

                        <MarkerContent>Or continue with</MarkerContent>
                    </Marker>
                    <div className="flex gap-1 items-center w-full ">
                        <Button
                            onClick={() => signIn('google', {
                                callbackUrl: '/'
                            })}
                            type="button"
                            variant={'outline'}
                            className="w-6/12 "
                            disabled={form.formState.isSubmitting}
                        >

                            <FcGoogle />  Google
                        </Button>
                        <Button
                            onClick={() => signIn('github', {
                                callbackUrl: '/'
                            })}
                            variant={'outline'}
                            type="button"
                            className="w-6/12"
                            disabled={form.formState.isSubmitting}
                        >

                            <FaGithub />  GitHub
                        </Button>
                    </div>

                </div>
                <p className="mx-auto w-fit text-sm">
                    Doesn't have an account? <Link href={'/signup'} className="font-medium underline" >Sign Up</Link>
                </p>

            </form>
        </div>
    )
}

export default SignIn
