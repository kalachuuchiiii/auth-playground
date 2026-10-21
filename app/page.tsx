
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Link href={'/signin'} >
        signin</Link>
      <Link href={'/signup'} >
        signup</Link>
    </div>
  );
}
