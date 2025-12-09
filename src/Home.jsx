import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check user authentication status on component mount
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('https://gosearch-backend.onrender.com', {
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

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('https://gosearch-backend.onrender.com/api/logout', {
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100">
      <header className="absolute top-0 right-0 p-4 flex items-center">
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
      </header>
      <main className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-7xl font-bold mb-8 text-blue-400 flex items-baseline">
          gosearch <span className="text-3xl ml-3 text-gray-400">by Manoj</span>
        </h1>
        <form onSubmit={handleSearch} className="w-full max-w-xl">
          <div className="relative">
            <input
              type="text"
              className="w-full px-6 py-4 text-xl rounded-full border border-gray-700 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
              placeholder="Search with Gemini AI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Home;
