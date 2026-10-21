import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { AuthForm, SignInSchema, SignUpSchema } from "../schemas";


export const useAuthForm = (schema: SignUpSchema | SignInSchema) => useForm<AuthForm>({
    resolver: zodResolver(schema),
    defaultValues: {
        email: "",
        password: "",
    },
})