'use client';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "../ui/tooltip";
import { SessionProvider } from "next-auth/react";



export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient();
    return (
        <>
            <SessionProvider basePath="/api/v1/auth">
                <QueryClientProvider client={queryClient}>
                    <TooltipProvider >
                        {children}
                    </TooltipProvider>
                </QueryClientProvider>
            </SessionProvider>
        </>
    )

}