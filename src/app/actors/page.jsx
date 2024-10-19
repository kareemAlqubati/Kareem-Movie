'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ActorsPage() {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/person/popular?api_key=05dcd03bf018854f4f916bca11dc23e4&language=en-US&page=${page}`
        );
        const data = await res.json();
        setActors(data.results || []);
        setTotalPages(data.total_pages); 
      } catch (error) {
        console.error('Failed to fetch actors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActors();
  }, [page]); 
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1); 
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1); 
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-emerald-500">Popular Actors</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {actors.map((actor) => (
              <div key={actor.id} className="bg-gray-800 p-4 rounded-lg">
                <Link href={`/actors/${actor.id}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                    alt={actor.name}
                    className="w-full h-64 object-cover rounded-lg cursor-pointer"
                  />
                  <h3 className="text-white mt-2">{actor.name}</h3>
                </Link>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={handlePreviousPage}
              className={`px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition duration-200 ${
                page === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={page === 1}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              className={`px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition duration-200 ${
                page === totalPages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
