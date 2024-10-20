'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; 
import Link from 'next/link';
import { auth } from '../firebaseConfig'; 
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'; 
import { onAuthStateChanged } from 'firebase/auth';

export default function TVShowsPage() {
  const [tvShows, setTvShows] = useState([]);
  const [user, setUser] = useState(null);
  const [likedShows, setLikedShows] = useState([]);
  
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'on_the_air'; 

  const getCategoryApiUrl = (category) => {
    switch (category) {
      case 'top-rated':
        return 'https://api.themoviedb.org/3/tv/top_rated';
      case 'popular':
        return 'https://api.themoviedb.org/3/tv/popular';
      case 'on-the-air':
        return 'https://api.themoviedb.org/3/tv/on_the_air';
      case 'airing-today':
        return 'https://api.themoviedb.org/3/tv/airing_today';
      default:
        return 'https://api.themoviedb.org/3/tv/on_the_air'; 
    }
  };

  useEffect(() => {
    const fetchTvShows = async () => {
      const apiUrl = getCategoryApiUrl(category);
      const response = await fetch(
        `${apiUrl}?api_key=05dcd03bf018854f4f916bca11dc23e4&language=en-US&page=1&include_adult=false`
      );

      const data = await response.json();
      if (data && data.results) {
        setTvShows(data.results);
      } else {
        setTvShows([]);
      }
    };

    fetchTvShows();
  }, [category]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchLikedShows(user.uid);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchLikedShows = async (userId) => {
    const db = getFirestore();
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setLikedShows(docSnap.data().likedShows || []);
    } else {
      setLikedShows([]);
    }
  };

  const handleLikeShow = async (showId) => {
    if (!user) return;

    const db = getFirestore();
    const userDoc = doc(db, "users", user.uid);
    const updatedLikes = likedShows.includes(showId)
      ? likedShows.filter(id => id !== showId)
      : [...likedShows, showId];

    await setDoc(userDoc, { likedShows: updatedLikes }, { merge: true });
    setLikedShows(updatedLikes);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-emerald-500 capitalize mb-4">
        {category.replace('-', ' ')} TV Shows
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {tvShows.map((show) => (
          <div key={show.id} className="relative">
            <Link href={`/tv/${show.id}`} className="block">
              <div className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative">
                <img
                  className="w-full h-64 object-cover rounded-lg"
                  src={show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : '/placeholder-image.jpg'}
                  alt={show.name}
                />
                <h3 className="mt-2 text-lg font-medium text-white">{show.name}</h3>
                <div className="absolute top-2 right-2">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-600 text-white font-bold">
                    {show.vote_average.toFixed(1)}
                  </div>
                </div>
              </div>
            </Link>
            {user && (
              <button
                className="absolute bottom-4 right-4 p-2 rounded-full "
                onClick={() => handleLikeShow(show.id)}
              >
                {likedShows.includes(show.id) ? '❤️' : '🤍'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
