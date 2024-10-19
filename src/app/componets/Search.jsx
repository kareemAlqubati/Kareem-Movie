'use client';


import { useState } from 'react';

export default function SearchForm() {
  const [searchTerm, setSearchTerm] = useState('');


  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      return; // Do nothing if the search term is empty
    }

    // Navigate to the search results page
    router.push(`/search/${searchTerm}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center space-x-2">
      <input
        type="text"
        className="px-4 py-2 rounded-lg bg-gray-200 text-black"
        placeholder="Search Movies/Actors"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        type="submit"
        className="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition duration-200"
      >
        Search
      </button>
    </form>
  );
}
