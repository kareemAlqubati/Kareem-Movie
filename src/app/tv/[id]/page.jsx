'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function MovieDetailsPage({ params }) {
  const { id } = params;
  const [movie, setMovie] = useState(null);
  const [actors, setActors] = useState([]);
  const [visibleActors, setVisibleActors] = useState(5);

  useEffect(() => {
    if (id) fetchData(id);
  }, [id]);

  const fetchData = async (id) => {
    try {
      const [movieRes, creditsRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=05dcd03bf018854f4f916bca11dc23e4&language=en-US`), // Corrected "api_key"
        fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=05dcd03bf018854f4f916bca11dc23e4&language=en-US`) // Corrected "api_key"
      ]);

      if (!movieRes.ok || !creditsRes.ok) {
        throw new Error('Failed to fetch tv data');
      }

      const movieData = await movieRes.json();
      const creditsData = await creditsRes.json();
      setMovie(movieData);
      setActors(creditsData.cast || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const showMoreActors = () => setVisibleActors((prev) => prev + 5);

  if (!movie) return <div className="text-center text-white">Loading...</div>;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-gray-800">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`,
          filter: 'blur(12px)',
        }}
      />
      <div className="bg-black bg-opacity-80 p-6 rounded-lg shadow-2xl max-w-4xl w-full">
        <div className="flex flex-col md:flex-row md:space-x-8 items-start">
          <img
            className="w-full md:w-1/3 rounded-lg shadow-md"
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            alt={movie.title}
          />
          <div className="mt-6 md:mt-0 text-white">
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            <div className="flex items-center mb-4">
              <span className="bg-emerald-600 text-white rounded-full px-4 py-2 font-bold">
                {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
              </span>
            </div>
            <p className="text-gray-300">{movie.overview}</p>
            <div className="mt-4">
              <p><strong>Release Date:</strong> {movie.release_date}</p>
              <p><strong>Votes:</strong> {movie.vote_count}</p>
            </div>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-semibold text-white">Cast</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
          {actors.slice(0, visibleActors).map((actor) => (
            <div key={actor.id} className="text-center">
              <Link href={`/actors/${actor.id}`}>
                <img
                  className="w-24 h-36 object-cover rounded-lg mx-auto shadow-md transition-transform transform hover:scale-105"
                  src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : '/placeholder-image.jpg'}
                  alt={actor.name}
                />
              </Link>
              <p className="text-white text-sm mt-2">{actor.name}</p>
              <p className="text-gray-400 text-xs">{actor.character}</p>
            </div>
          ))}
        </div>

        {visibleActors < actors.length && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={showMoreActors}
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
