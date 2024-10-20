'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; 

export default function SearchResults() {
  const { searchTerm } = useParams();
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!searchTerm) return;

    const fetchSearchResults = async () => {
      setLoading(true);

      try {
        const [moviesRes, tvRes, peopleRes] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=05dcd03bf018854f4f916bca11dc23e4&query=${searchTerm}&language=en-US&page=1&include_adult=false`
          ),
          fetch(
            `https://api.themoviedb.org/3/search/tv?api_key=05dcd03bf018854f4f916bca11dc23e4&query=${searchTerm}&language=en-US&page=1&include_adult=false`
          ),
          fetch(
            `https://api.themoviedb.org/3/search/person?api_key=05dcd03bf018854f4f916bca11dc23e4&query=${searchTerm}&language=en-US&page=1&include_adult=false`
          ),
        ]);

        const [moviesData, tvData, peopleData] = await Promise.all([
          moviesRes.json(),
          tvRes.json(),
          peopleRes.json(),
        ]);

        setMovies(moviesData.results || []);
        setTvShows(tvData.results || []);
        setActors(peopleData.results || []);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">Search Results for &quot;{searchTerm}&quot;</h1>

      <h2 className="text-xl mt-4">Movies</h2>
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="bg-gray-800 p-4 rounded-lg">
              <Link href={`/movie/${movie.id}`}>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  width={500}
                  height={750} 
                  className="w-full h-64 object-cover rounded-lg"
                />
                <h3 className="text-white mt-2">{movie.title}</h3>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No movies found.</p>
      )}

      <h2 className="text-xl mt-4">TV Shows</h2>
      {tvShows.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {tvShows.map((show) => (
            <div key={show.id} className="bg-gray-800 p-4 rounded-lg">
              <Link href={`/tv/${show.id}`}>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                  alt={show.name}
                  width={500} 
                  height={750} 
                  className="w-full h-64 object-cover rounded-lg"
                />
                <h3 className="text-white mt-2">{show.name}</h3>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No TV shows found.</p>
      )}

      <h2 className="text-xl mt-4">Actors</h2>
      {actors.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {actors.map((actor) => (
            <div key={actor.id} className="bg-gray-800 p-4 rounded-lg">
              <Link href={`/actor/${actor.id}`}>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                  alt={actor.name}
                  width={500} 
                  height={750}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <h3 className="text-white mt-2">{actor.name}</h3>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No actors found.</p>
      )}
    </div>
  );
}
