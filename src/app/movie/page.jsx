'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // To access URL search params
import Link from 'next/link';

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track any errors

  const searchParams = useSearchParams(); // To get the category from URL params
  const category = searchParams.get('category') || 'now_playing'; // Default to 'now_playing' if no category

  // Function to return the API endpoint based on the category
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
        return 'https://api.themoviedb.org/3/movie/now_playing'; // Default API for now playing
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true); // Start loading
      setError(null); // Reset error state

      const apiUrl = getCategoryApiUrl(category);
      try {
        const response = await fetch(
          `${apiUrl}?api_key=05dcd03bf018854f4f916bca11dc23e4&language=en-US&page=1`
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
        setError('Failed to fetch movies. Please try again later.'); // Update error state
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchMovies();
  }, [category]); // Re-run the effect when category changes

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-emerald-500 capitalize mb-4">
        {category.replace('-', ' ')} Movies
      </h1>

      {loading && <p className="text-white">Loading movies...</p>} {/* Loading message */}

      {error && <p className="text-red-500">{error}</p>} {/* Error message */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movie/${movie.id}`} className="block">
            <div className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative">
              <img
                className="w-full h-64 object-cover rounded-lg"
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-image.jpg'}
                alt={movie.title}
              />
              <h3 className="mt-2 text-lg font-medium text-white">{movie.title}</h3>

              {/* Vote average circle */}
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
