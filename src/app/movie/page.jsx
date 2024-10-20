'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; 
import Link from 'next/link';
import { auth } from '../firebaseConfig'; 
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image'; 

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [likedMovies, setLikedMovies] = useState([]);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchLikedMovies(user.uid); 
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchLikedMovies = async (userId) => {
    const db = getFirestore();
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setLikedMovies(docSnap.data().likedMovies || []);
    } else {
      setLikedMovies([]);
    }
  };

  const handleLikeMovie = async (movieId) => {
    if (!user) return;

    const db = getFirestore();
    const userDoc = doc(db, "users", user.uid);
    const updatedLikes = likedMovies.includes(movieId)
      ? likedMovies.filter(id => id !== movieId)
      : [...likedMovies, movieId];

    await setDoc(userDoc, { likedMovies: updatedLikes }, { merge: true });
    setLikedMovies(updatedLikes);
  };

  return (
    <div className="container mx-auto p-4 m-4">
      <h1 className="text-4xl font-bold text-center text-blue-500 dark:text-blue-400 mb-12">
        {category.replace('-', ' ')} Movies
      </h1>

      {loading && <p className="text-white">Loading movies...</p>} 

      {error && <p className="text-red-500">{error}</p>} 

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="relative border border-gray-700 rounded-lg overflow-hidden transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl bg-gray-800">
            <Link href={`/movie/${movie.id}`} className="block">
              <Image
                className="w-full h-64 object-cover"
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-image.jpg'}
                alt={movie.title}
                width={500} 
                height={400} 
              />
              <h3 className="mt-2 text-lg font-medium text-white text-center">{movie.title}</h3>
              <div className="absolute top-2 right-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-600 text-white font-bold">
                  {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </div>
              </div>
            </Link>
            {user && (
              <button
                className="absolute bottom-4 right-4 p-2 rounded-full bg-blue-600 hover:bg-blue-500 transition duration-200 text-white"
                onClick={() => handleLikeMovie(movie.id)}
              >
                {likedMovies.includes(movie.id) ? '❤️' : '🤍'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
