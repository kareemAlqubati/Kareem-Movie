'use client';

import Image from 'next/image';

export default function Loading() {
  return (
    <div className="flex justify-center">
      <Image
        className="h-32"
        src="/Spinner@1x-1.6s-200px-200px (3).svg"
        alt="Loading..."
        width={200} 
        height={200} 
      />
    </div>
  );
}
