import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.css'; // Importing external CSS file

const USearchEntrance = () => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query) {
      setError('Please enter a search term.');
      return;
    }
    navigate(`/ensearch-results?query=${encodeURIComponent(query)}`);
  };

  return (
    <div className="usearch-container">

      {/* Search Input */}
      <input
        type="text"
        className="usearch-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Entrance..."
      />
      <button className="usearch-button" onClick={handleSearch}>Search</button>

      {/* Error Message */}
      {error && <p className="uerror-message">{error}</p>}
    </div>
  );
};

export default USearchEntrance;
