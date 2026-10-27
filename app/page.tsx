
'use client';
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const session = useSession();
  console.log(session);


  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Link href={'/signin'} >
        signin</Link>
      <Link href={'/signup'} >
        signup</Link>
      {
        session.status === 'authenticated' && (<p>
          hi, {session.data.user.name}!
        </p>)
      }
    </div>
  );
}
