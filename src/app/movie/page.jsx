'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; 
import Link from 'next/link';

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  const searchParams = useSearchParams(); 
  const category = searchParams.get('category') || 'now_playing'; 
  const getCategoryApiUrl = (category) => {
    switch (category) {
      case 'top-rated':
        return 'https://api.themoviedb.org/3/movie/top_rated';
      case 'popular':
        return 'https://api.themoviedb.org/3/movie/popular';
      case 'now-playing':
        return 'https://api.themoviedb.org/3/movie/now_playing';
      case 'upcoming':
        return 'https://api.themoviedb.org/3/movie/upcoming';
      default:
        return 'https://api.themoviedb.org/3/movie/now_playing'; 
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true); 
      setError(null); 

      const apiUrl = getCategoryApiUrl(category);
      try {
        const response = await fetch(
          `${apiUrl}?api_key=05dcd03bf018854f4f916bca11dc23e4&language=en-US&page=1&include_adult=false`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.results) {
          setMovies(data.results);
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error('Failed to fetch movies:', error);
        setError('Failed to fetch movies. Please try again later.'); 
      } finally {
        setLoading(false); 
      }
    };

    fetchMovies();
  }, [category]); 

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-emerald-500 capitalize mb-4">
        {category.replace('-', ' ')} Movies
      </h1>

      {loading && <p className="text-white">Loading movies...</p>} 

      {error && <p className="text-red-500">{error}</p>} 

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movie/${movie.id}`} className="block">
            <div className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative">
              <img
                className="w-full h-64 object-cover rounded-lg"
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-image.jpg'}
                alt={movie.title} />
              <h3 className="mt-2 text-lg font-medium text-white">{movie.title}</h3>
              <div className="absolute top-2 right-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-600 text-white font-bold">
                  {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
