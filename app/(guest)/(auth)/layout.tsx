import { Toaster } from "sonner";


export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const methods = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'];
    return (
        <div className="w-full relative dark bg-stone-900 flex min-h-screen h-full">
            <Toaster position="bottom-right" />
            <div className=" flex flex-col h-full items-start justify-center text-neutral-100 w-6/12  ">

                <div className=" w-10/12 z-200 mx-auto ">
                    <div className="w-8/12 space-y-4">
                        <h1 className="text-5xl font-bold tracking-tighter">
                            Ignite your API workflow.
                        </h1>
                        <p className="text-neutral-300">Fuel your development with a focused workspace for API testing, debugging, and discovery.</p>
                        <ul className="flex items-center justify-start gap-2">
                            {
                                methods.map((m) => <li className="px-2 rounded font-semibold  text-stone-300 border bg-stone-100/5 transition-colors duration-300 " key={m}>
                                    {m}
                                </li>)
                            }
                        </ul>
                    </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-[85%] opacity-85
    bg-[radial-gradient(ellipse_75%_100%_at_50%_100%,color-mix(in_oklab,var(--color-orange-300)_70%,var(--color-neutral-900))_0%,color-mix(in_oklab,var(--color-coral-red)_75%,var(--color-neutral-900))_30%,color-mix(in_oklab,var(--color-coral-red)_30%,transparent)_60%,transparent_100%)]" />
            </div>
            <div className="w-6/12 z-200 h-full  bg-neutral-900/25 flex items-enter justify-center  ">

                {children}

            </div>
        </div>
    )
}