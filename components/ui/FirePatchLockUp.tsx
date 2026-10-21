import { FirePatchLogo } from "./FirePatchLogo"


export const FirePatchLockUp = ({ width = 40 }: { width?: number }) => {

    return <div style={{
        width: `${width * 2}px`
    }} className={`@container flex items-center justify-center    `} >
        <FirePatchLogo className="aspect-square size-[22cqw] " />
        <p className="text-[20cqw] font-bold tracking-tighter">Firepatch</p>
    </div>
}