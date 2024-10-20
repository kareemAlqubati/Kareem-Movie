'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Darkmode from './Darkmode';

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoviesDropdownOpen, setIsMoviesDropdownOpen] = useState(false);
  const [isTvShowsDropdownOpen, setIsTvShowsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const moviesDropdownRef = useRef(null);
  const tvShowsDropdownRef = useRef(null);

  useEffect(() => {
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

  const handleClickOutside = (e) => {
    if (
      moviesDropdownRef.current && !moviesDropdownRef.current.contains(e.target)
    ) {
      setIsMoviesDropdownOpen(false);
    }
    if (
      tvShowsDropdownRef.current && !tvShowsDropdownRef.current.contains(e.target)
    ) {
      setIsTvShowsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMoviesDropdownClick = () => {
    setIsMoviesDropdownOpen((prev) => !prev);
    setIsTvShowsDropdownOpen(false); // Close TV shows dropdown if movies is clicked
  };

  const handleTvShowsDropdownClick = () => {
    setIsTvShowsDropdownOpen((prev) => !prev);
    setIsMoviesDropdownOpen(false); // Close movies dropdown if TV shows is clicked
  };

  return (
    <nav className="bg-gray-900 p-4  fixed w-full z-10 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-white text-3xl font-extrabold hover:text-blue-500 transition">
          Kareem Movie 
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          <div className="relative" ref={moviesDropdownRef}>
            <button
              className="text-white hover:text-blue-500 focus:outline-none"
              onClick={handleMoviesDropdownClick}
            >
              Movies
            </button>
            {isMoviesDropdownOpen && (
              <ul className="absolute left-0 mt-2 bg-gray-800 text-white rounded-md shadow-lg w-48 py-2 z-20">
                {['Top Rated', 'Popular', 'Now Playing', 'Upcoming'].map((label) => (
                  <li key={label}>
                    <Link
                      href={`/movie?category=${label.toLowerCase()}`}
                      className="block px-4 py-2 hover:bg-gray-700 transition"
                      onClick={() => setIsMoviesDropdownOpen(false)} // Close on link click
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="relative" ref={tvShowsDropdownRef}>
            <button
              className="text-white hover:text-blue-500 focus:outline-none"
              onClick={handleTvShowsDropdownClick}
            >
              TV Shows
            </button>
            {isTvShowsDropdownOpen && (
              <ul className="absolute left-0 mt-2 bg-gray-800 text-white rounded-md shadow-lg w-48 py-2 z-20">
                {['Top Rated', 'Popular', 'On The Air', 'Airing Today'].map((label) => (
                  <li key={label}>
                    <Link
                      href={`/tv?category=${label.toLowerCase().replace(' ', '-')}`}
                      className="block px-4 py-2 hover:bg-gray-700 transition"
                      onClick={() => setIsTvShowsDropdownOpen(false)} // Close on link click
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link href="/actors" className="text-white hover:text-blue-500 transition">
            Actors
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <input
              type="text"
              className="px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition shadow-sm">
              Search
            </button>
          </form>

          {user ? (
            <div className="flex items-center space-x-4">
              <div className="bg-gray-800 px-4 py-2 rounded-full text-white shadow-md">
                {user.displayName || user.email}
              </div>
              <button
                onClick={handleLogout}
                className="text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500 transition shadow-md"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link href="/Login" className="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition shadow-md">
                Login
              </Link>
              <Link href="/Register" className="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition shadow-md">
                Register
              </Link>
            </div>
          )}

          <Darkmode />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="text-white md:hidden focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 bg-gray-800 rounded-md shadow-lg">
          <ul className="text-white py-2">
            <li className="block px-4 py-2 hover:bg-gray-700 transition">
              <button onClick={handleMoviesDropdownClick}>Movies</button>
              {isMoviesDropdownOpen && (
                <ul className="pl-4">
                  {['Top Rated', 'Popular', 'Now Playing', 'Upcoming'].map((label) => (
                    <li key={label}>
                      <Link
                        href={`/movie?category=${label.toLowerCase()}`}
                        className="block px-4 py-2 hover:bg-gray-700 transition"
                        onClick={() => {
                          setIsMoviesDropdownOpen(false); // Close on link click
                          setIsMobileMenuOpen(false); // Close mobile menu
                        }}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li className="block px-4 py-2 hover:bg-gray-700 transition">
              <button onClick={handleTvShowsDropdownClick}>TV Shows</button>
              {isTvShowsDropdownOpen && (
                <ul className="pl-4">
                  {['Top Rated', 'Popular', 'On The Air', 'Airing Today'].map((label) => (
                    <li key={label}>
                      <Link
                        href={`/tv?category=${label.toLowerCase().replace(' ', '-')}`}
                        className="block px-4 py-2 hover:bg-gray-700 transition"
                        onClick={() => {
                          setIsTvShowsDropdownOpen(false); // Close on link click
                          setIsMobileMenuOpen(false); // Close mobile menu
                        }}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li className="block px-4 py-2 hover:bg-gray-700 transition">
              <Link href="/actors">Actors</Link>
            </li>

            <li className="block px-4 py-2">
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <input
                  type="text"
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition">
                  Search
                </button>
              </form>
            </li>

            <li className="block px-4 py-2">
              <Darkmode />
            </li>

            {user ? (
              <li className="block px-4 py-2">
                <button
                  onClick={handleLogout}
                  className="w-full text-left bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li className="block px-4 py-2">
                  <Link href="/Login" className="hover:bg-gray-700 transition">
                    Login
                  </Link>
                </li>
                <li className="block px-4 py-2">
                  <Link href="/Register" className="hover:bg-gray-700 transition">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
