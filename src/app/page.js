'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import MovieBanner from './componets/MovieBanner';
import Image from 'next/image'; 

export default function HomePage() {
  const [latestMovies, setLatestMovies] = useState([]);

  useEffect(() => {
    const fetchLatestMovies = async () => {
      const response = await fetch(
        'https://api.themoviedb.org/3/movie/now_playing?api_key=05dcd03bf018854f4f916bca11dc23e4&language=en-US&page=1&include_adult=false'
      );
      const data = await response.json();

      if (data && data.results) {
        setLatestMovies(data.results);
      } else {
        setLatestMovies([]);
      }
    };

    fetchLatestMovies();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <MovieBanner />
      <h1 className="text-3xl font-bold text-emerald-500 capitalize mb-4">
        Latest Movies
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {latestMovies.map((movie) => (
          <div key={movie.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <Image
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-image.jpg'}
              alt={movie.title}
              className="rounded-md mb-2"
              width={500} 
              height={750} 
            />
            <h2 className="text-xl font-semibold text-white">{movie.title}</h2>
            <Link href={`/movie/${movie.id}`} className="text-emerald-500 hover:text-emerald-400 transition">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
