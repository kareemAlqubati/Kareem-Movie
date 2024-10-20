'use client';

import Image from 'next/image'; 

export default function MovieBanner() {
  return (
    <div className="relative h-screen w-full bg-gray-900 p-8">
      <div className="absolute inset-0">
        <Image
          src="/2208.q703.021.S.m004.c12.FP movie film cinema poster banner.jpg"
          alt="Movie Banner"
          layout="fill" 
          objectFit="cover" 
          className="filter blur-sm"
        />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-full text-slate-800 px-6 pt-16">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-wider mb-4">
          Welcome to Movie Kareem
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl">
          Discover the latest and greatest movies in high quality!
        </p>
        <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-lg transition duration-300">
          Explore Movies
        </button>
      </div>
    </div>
  );
}
