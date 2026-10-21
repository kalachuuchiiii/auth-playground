import Image, { type ImageProps } from "next/image"

type FirePatchProps = Omit<ImageProps, "src" | "alt">

export const FirePatchLogo = (props: FirePatchProps) => (
    <Image
        width={500}
        height={500}
        src="/images/firepatch-transparent.png"
        alt="FirePatch Logo"
        {...props}
    />
)