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
    <div className="container mx-auto px-4 py-6">
      <MovieBanner />
      <h1 className="text-2xl font-bold text-blue-500 capitalize m-4 text-center">Latest Movies</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {latestMovies.map((movie) => (
          <Link key={movie.id} href={`/movie/${movie.id}`}>
            <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer group">
              <div className="flex justify-center mb-3">
                <Image
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-image.jpg'}
                  alt={movie.title}
                  className="rounded-md w-full h-auto transition duration-300 transform group-hover:scale-105"
                  width={180}
                  height={270} 
                />
              </div>
              <h2 className="text-sm font-semibold text-white text-center mb-1 transition duration-200 group-hover:text-blue-400">
                {movie.title}
              </h2>
              <div className="flex justify-between items-center mb-1">
                <span className="text-blue-400 font-bold text-sm">{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                <button className="bg-blue-600 text-white text-xs px-2 py-1 rounded-md hover:bg-blue-700 transition">
                  Watch
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
