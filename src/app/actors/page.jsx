'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ActorsPage() {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/person/popular?api_key=05dcd03bf018854f4f916bca11dc23e4&language=en-US&page=${page}&include_adult=false`
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
    <div className="container mx-auto p-6 m-4">
      <h1 className="text-4xl font-bold text-center text-blue-500 dark:text-blue-400 mb-12">Popular Actors</h1>
      {loading ? (
        <p className="text-center text-gray-700 dark:text-gray-300">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {actors.map((actor) => (
              <div
                key={actor.id}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 border border-gray-200 dark:border-gray-700"
              >
                <Link href={`/actors/${actor.id}`}>
                  <Image
                    src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : '/placeholder-image.jpg'}
                    alt={actor.name}
                    width={500} 
                    height={750} 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <h3 className="text-gray-900 dark:text-gray-100 text-lg font-semibold mt-4 text-center">
                    {actor.name}
                  </h3>
                </Link>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-4 mt-12">
            <button
              onClick={handlePreviousPage}
              className={`px-6 py-3 rounded-full  text-white bg-blue-600 ${
                page === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={page === 1}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              className={`px-6 py-3 rounded-full  bg-blue-600 text-white  ${
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
