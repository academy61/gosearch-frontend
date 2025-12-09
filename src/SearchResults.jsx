import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';

function SearchResults() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const query = searchParams.get('q');
  const [currentSearchTerm, setCurrentSearchTerm] = useState(query || '');


  // Fetch search results
  useEffect(() => {
    if (query) {
      setLoading(true);
      setError(null);
      fetch(`http://127.0.0.1:5000/api/search?q=${encodeURIComponent(query)}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
            if (typeof data === 'string') {
                try {
                    setSearchResults(JSON.parse(data));
                } catch (jsonError) {
                    throw new Error(`Failed to parse Gemini response as JSON: ${jsonError.message}`);
                }
            } else {
                setSearchResults(data);
            }
        })
        .catch(error => {
          console.error("Error fetching search results:", error);
          setError("Failed to fetch search results. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [query]);

  // Check user authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/user', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.is_authenticated);
          setUsername(data.username);
        } else {
          setIsAuthenticated(false);
          setUsername('');
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
        setUsername('');
      }
    };
    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        setIsAuthenticated(false);
        setUsername('');
        navigate('/'); // Redirect to home after logout
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (currentSearchTerm.trim()) {
        navigate(`/search?q=${encodeURIComponent(currentSearchTerm.trim())}`);
    }
  };

  // Handle case where query is missing
  if (!query) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
        <p className="text-xl text-gray-400">Please enter a search query.</p>
      </div>
    );
  }

  // Display loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
        <p className="text-xl text-blue-400">Searching for "{query}" with Gemini AI...</p>
        {/* You can add a spinner or loading animation here */}
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
        <p className="text-xl text-red-400">Error: {error}</p>
      </div>
    );
  }

  // Display no results found
  if (!searchResults || searchResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
        <p className="text-xl text-gray-400">No results found for "{query}".</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8">
      <header className="flex flex-col sm:flex-row items-center justify-between py-4 border-b border-gray-700 mb-6">
        <div className="flex items-baseline mb-4 sm:mb-0"> {/* Added flex and items-baseline */}
          <a href="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300">gosearch</a>
          <span className="text-lg ml-2 text-gray-400">by Manoj</span> {/* Added "by Manoj" */}
        </div>
        <form onSubmit={handleSearchSubmit} className="flex-grow mx-0 sm:mx-4 max-w-xl w-full sm:w-auto">
          <input
            type="text"
            className="w-full px-4 py-2 rounded-full border border-gray-700 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={currentSearchTerm}
            onChange={(e) => setCurrentSearchTerm(e.target.value)}
          />
        </form>
        <div className="flex items-center mt-4 sm:mt-0">
          {isAuthenticated ? (
            <>
              <span className="text-gray-300 mr-4">Hello, {username}</span>
              <Link to="/settings" className="text-gray-400 hover:text-gray-100 mr-4">Settings</Link>
              <button onClick={handleLogout} className="text-gray-400 hover:text-gray-100">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-400 hover:text-gray-100 mr-4">Login</Link>
              <Link to="/register" className="text-gray-400 hover:text-gray-100">Register</Link>
            </>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-4">Results for "{query}"</p>
        {searchResults.map((result, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-semibold text-blue-400 hover:underline">
              <a href={result.link} target="_blank" rel="noopener noreferrer">{result.title}</a>
            </h3>
            <p className="text-green-300 text-sm mb-1">{result.link}</p>
            <p className="text-gray-300">{result.snippet}</p>
          </div>
        ))}
      </main>
    </div>
  );
}

export default SearchResults;