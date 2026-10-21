'use client';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "../ui/tooltip";



export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient();
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <TooltipProvider >
                    {children}
                </TooltipProvider>
            </QueryClientProvider>
        </>
    )

}