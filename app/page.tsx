import Image from "next/image";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Copy.ai",
  description: "Copy.ai",
};


export default function Home() {
  return (
    <main className='flex-1 flex justify-center grow'>
      <div className='grow flex items-center justify-center'>
        {/* <Layout /> */}
      </div>
    </main>
  );
}
