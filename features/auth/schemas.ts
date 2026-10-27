import z from "zod";



export const signUpFormSchema = z.object({
    email: z
        .email("Please enter a valid email address.")
        .min(1, "Email is required."),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .max(128, "Password must not exceed 128 characters."),
});

export const signInFormSchema = z.object({
    email: z
        .email("Incorrect email or password.")
        .min(1, "Incorrect email or password."),
    password: z
        .string()
        .min(8, "Incorrect email or password.")
        .max(36, "Incorrect email or password."),
})
export const codeSchema = z
    .string()
    .length(6)
    .regex(/^\d{6}$/, "Code must be exactly 6 digits.");
export type SignUpForm = z.infer<typeof signUpFormSchema>;
export type SignInForm = z.infer<typeof signInFormSchema>;


