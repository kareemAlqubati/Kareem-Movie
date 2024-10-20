'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image'; 

export default function ActorDetailsPage({ params }) {
  const { id } = params;
  const [actor, setActor] = useState(null);
  const [movies, setMovies] = useState([]);
  const [visibleMovies, setVisibleMovies] = useState(5);

  useEffect(() => {
    if (id) fetchData(id);
  }, [id]);

  const fetchData = async (id) => {
    try {
      const [actorRes, moviesRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/person/${id}?api_key=05dcd03bf018854f4f916bca11dc23e4&language=en-US&include_adult=false`),
        fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=05dcd03bf018854f4f916bca11dc23e4&language=en-US&include_adult=false`)
      ]);

      if (!actorRes.ok || !moviesRes.ok) {
        throw new Error('Failed to fetch actor data');
      }

      const actorData = await actorRes.json();
      const moviesData = await moviesRes.json();
      setActor(actorData);
      setMovies(moviesData.cast || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const showMoreMovies = () => setVisibleMovies((prev) => prev + 5);

  if (!actor) return <div className="text-center text-white">Loading...</div>;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: actor.profile_path
            ? `url(https://image.tmdb.org/t/p/original/${actor.profile_path})`
            : 'url(/placeholder-image.jpg)', 
          filter: 'blur(10px)',
        }}
      />
      <div className="relative  background-color: rgb(0 0 0 / 35%); bg-opacity-90 p-8 rounded-xl shadow-2xl max-w-6xl  m-10 w-full z-0">
        <div className="flex flex-col md:flex-row md:space-x-10 items-start">
          <Image
            className="w-full md:w-1/3 rounded-lg shadow-lg"
            src={actor.profile_path ? `https://image.tmdb.org/t/p/w500/${actor.profile_path}` : '/placeholder-image.jpg'}
            alt={actor.name}
            width={500} 
            height={750}
          />
          <div className="mt-6 md:mt-0 text-white">
            <h1 className="text-5xl font-extrabold mb-4 tracking-wide text-gray-200">{actor.name}</h1>
            <p className="text-gray-300 leading-relaxed mb-6">
              {actor.biography ? actor.biography : 'Biography not available.'}
            </p>
            <div className="mt-4 space-y-3">
              <p className="text-lg text-gray-200">
                <strong>Birthday:</strong> {actor.birthday || 'N/A'}
              </p>
              <p className="text-lg text-gray-200">
                <strong>Popularity:</strong> {actor.popularity ? actor.popularity.toFixed(1) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-12 text-4xl font-semibold text-white">Movies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mt-8">
          {movies.slice(0, visibleMovies).map((movie) => (
            <div key={movie.id} className="text-center">
              <Link href={`/movie/${movie.id}`}>
                <Image
                  className="w-full h-auto object-cover rounded-lg mx-auto shadow-md transition-transform transform hover:scale-105 hover:shadow-xl"
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-image.jpg'}
                  alt={movie.title}
                  width={120} 
                  height={180}
                />
              </Link>
              <p className="text-white text-lg mt-3 font-semibold">{movie.title}</p>
              <p className="text-gray-400 text-sm">{movie.character}</p>
            </div>
          ))}
        </div>

        {visibleMovies < movies.length && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={showMoreMovies}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-full hover:from-blue-600 hover:to-indigo-700 transition-transform transform hover:scale-105 shadow-lg"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
