import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FirePatchLockUp } from "@/components/ui/FirePatchLockUp";
import { FirePatchLogo } from "@/components/ui/FirePatchLogo";
import { ChevronDown, Globe } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";


export default function GuestLayout({ children }: { children: ReactNode }) {

    return <div className="h-full flex flex-col">
        <nav className="bg-stone-900 w-full flex items-center justify-between text-neutral-100 px-4 py-2 border-b border-b-stone-100/7.5">
            <div className="flex items-center  gap-8">
                <Link href={'/'}>
                    <FirePatchLockUp width={50} /></Link>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger className={'flex hover:bg-stone-300/10 px-2 py-1 transition-colors duration-300 rounded text-stone-300 font-semibold items-center gap-1'}>
                            Product <ChevronDown className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            hi
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger className={'flex hover:bg-stone-300/10 px-2 py-1 transition-colors duration-300 rounded text-stone-300 font-semibold items-center gap-1'}>
                            Features <ChevronDown className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            hi
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className=" flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger className={'flex hover:bg-stone-300/10 p-2 transition-colors duration-300 rounded text-stone-300 font-semibold items-center gap-1'}>
                        <Globe className="size-4" /> <ChevronDown className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        hi
                    </DropdownMenuContent>
                </DropdownMenu>
                <Link href='/signin'>
                    <Button variant={'outline'}>
                        Sign In
                    </Button></Link>
                <Link href={'/signup'}>
                    <Button >
                        Sign Up
                    </Button></Link>
            </div>
        </nav>
        <div className="min-h-screen">
            {children}
        </div>
    </div>
}