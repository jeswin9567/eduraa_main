import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.css'

const USearchScholarship = () => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query) {
      setError('Please enter a search term.');
      return;
    }
    // Navigate to the search results page with the query as a URL parameter
    navigate(`/search-results?query=${encodeURIComponent(query)}`);
  };

  return (
    <div>

      {/* Search Input */}
      <input
        type="text"
        className='usearch-input'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search scholarships..."
      />
      <button className='usearch-button' onClick={handleSearch}>Search</button>

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default USearchScholarship;
