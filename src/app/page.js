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
    <div className="container mx-auto px-4 py-6"> {/* Add px-4 for horizontal padding */}
      <MovieBanner />
      <h1 className="text-3xl font-bold text-blue-500 capitalize mb-4">Latest Movies</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {latestMovies.map((movie) => (
          <Link key={movie.id} href={`/movie/${movie.id}`}>
            <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer">
              <Image
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-image.jpg'}
                alt={movie.title}
                className="rounded-md mb-2 transition duration-300 transform hover:scale-105"
                width={300} 
                height={450} 
              />
              <h2 className="text-lg font-semibold text-white mb-1">{movie.title}</h2>
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-400 font-bold">{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                <button className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition">
                  Watch
                </button>
              </div>
              <span className="text-blue-400 hover:text-blue-300 transition duration-200">View Details</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
