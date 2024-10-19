'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ActorDetailsPage({ params }) {
  const { id } = params;
  const [actor, setActor] = useState(null);
  const [movie, setMovies] = useState([]);
  const [visibleMovie, setVisibleMovie] = useState(5);

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
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-gray-800">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: actor.profile_path
            ? `url(https://image.tmdb.org/t/p/original/${actor.profile_path})`
            : 'url(/placeholder-image.jpg)', 
          filter: 'blur(12px)',
        }}
      />
      <div className="bg-black bg-opacity-80 p-6 rounded-lg shadow-2xl max-w-4xl w-full">
        <div className="flex flex-col md:flex-row md:space-x-8 items-start">
          <img
            className="w-full md:w-1/3 rounded-lg shadow-md"
            src={actor.profile_path ? `https://image.tmdb.org/t/p/w500/${actor.profile_path}` : '/placeholder-image.jpg'}
            alt={actor.name}
          />
          <div className="mt-6 md:mt-0 text-white">
            <h1 className="text-4xl font-bold mb-2">{actor.name}</h1>
            <p className="text-gray-300">{actor.biography || 'Biography not available.'}</p>
            <div className="mt-4">
              <p><strong>Birthday:</strong> {actor.birthday || 'N/A'}</p>
              <p><strong>Popularity:</strong> {actor.popularity ? actor.popularity.toFixed(1) : 'N/A'}</p>
            </div>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-semibold text-white">Movies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
          {movie.slice(0, visibleMovie).map((movie) => (
            <div key={movie.id} className="text-center">
              <Link href={`/movie/${movie.id}`}>
                <img
                  className="w-24 h-36 object-cover rounded-lg mx-auto shadow-md transition-transform transform hover:scale-105"
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-image.jpg'}
                  alt={movie.title}
                />
              </Link>
              <p className="text-white text-sm mt-2">{movie.title}</p>
              <p className="text-gray-400 text-xs">{movie.character}</p>
            </div>
          ))}
        </div>

        {visibleMovie < movie.length && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={showMoreMovies}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
