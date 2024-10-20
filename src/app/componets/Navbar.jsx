'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebaseConfig'; 
import { onAuthStateChanged, signOut } from 'firebase/auth'; 
import Darkmode from './Darkmode';

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoviesDropdownOpen, setIsMoviesDropdownOpen] = useState(false);
  const [isTvShowsDropdownOpen, setIsTvShowsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null); 
  const router = useRouter();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(
          'https://api.themoviedb.org/3/genre/movie/list?api_key=05dcd03bf018854f4f916bca11dc23e4&language=en-US&include_adult=false'
        );
        const data = await res.json();
        setGenres(data.genres || []);
      } catch (error) {
        console.error('Error fetching genres:', error);
        setGenres([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      router.push(`/search/${searchTerm}`);
    }
  };

  return (
    <nav className="bg-gray-900 p-4 fixed w-full z-10 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-white text-3xl font-bold hover:text-blue-400 transition">
          Movie Kareem
        </Link>
        <button className="text-white md:hidden focus:outline-none"  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}  >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"   d="M4 6h16M4 12h16m-7 6h7"  ></path>
        </button>
        <div className="hidden md:flex items-center space-x-6">
          <Darkmode />
          <div className="relative">
            <button  className="text-white hover:text-blue-400 focus:outline-none"  onClick={() => setIsMoviesDropdownOpen(!isMoviesDropdownOpen)} >
              Movies
            </button>
            {isMoviesDropdownOpen && (
              <ul className="absolute mt-2 bg-gray-800 text-white rounded-md shadow-lg w-48 py-2 z-20">
                {['Top Rated', 'Popular', 'Now Playing', 'Upcoming'].map((label) => (
                  <li key={label}>
                    <Link href={`/movie?category=${label.toLowerCase()}`} className="block px-4 py-2 hover:bg-gray-700 transition">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="relative">
            <button className="text-white hover:text-blue-400 focus:outline-none" onClick={() => setIsTvShowsDropdownOpen(!isTvShowsDropdownOpen)} >
              TV Shows
            </button>
            {isTvShowsDropdownOpen && (
              <ul className="absolute mt-2 bg-gray-800 text-white rounded-md shadow-lg w-48 py-2 z-20">
                {['Top Rated', 'Popular', 'On The Air', 'Airing Today'].map((label) => (
                  <li key={label}>
                    <Link href={`/tv?category=${label.toLowerCase().replace(' ', '-')}`} className="block px-4 py-2 hover:bg-gray-700 transition">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Link href="/actors" className="text-white hover:text-blue-400 transition">
            Actors
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-full text-white shadow-lg">
                <span className="text-lg font-semibold">
                  {user.displayName || user.email}
                </span>
              </div>
              <button onClick={handleLogout} className="text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500 transition">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/Login" className="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition">
                Login
              </Link>
              <Link href="/Register" className="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition">
                Register
              </Link>
            </>
          )}
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <input  type="text" className="px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition duration-200 focus:outline-none"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 bg-gray-800 rounded-md shadow-lg">
          <ul className="text-white rounded-md py-2">
            <li>
              <Link href="/movie" className="block px-4 py-2 hover:bg-gray-700 transition">
                Movies
              </Link>
            </li>
            <li>
              <Link href="/tv" className="block px-4 py-2 hover:bg-gray-700 transition">
                TV Shows
              </Link>
            </li>
            <li>
              <Link href="/actors" className="block px-4 py-2 hover:bg-gray-700 transition">
                Actors
              </Link>
            </li>
            <li>
              <Link href="/Login" className="block px-4 py-2 hover:bg-gray-700 transition">
                Login
              </Link>
            </li>
            <li>
              <Link href="/Register" className="block px-4 py-2 hover:bg-gray-700 transition bg-blue-600 rounded-md">
                Register
              </Link>
            </li>
            <li className="px-4 py-2">
              <Darkmode />
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
