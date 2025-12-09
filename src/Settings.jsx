import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Settings() {
  const [settings, setSettings] = useState({ dark_mode: true, safe_search: false });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current settings from backend
    const fetchSettings = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/settings', {
          credentials: 'include' // Important for sending cookies
        });
        if (response.status === 401) {
          navigate('/login'); // Redirect to login if not authenticated
          return;
        }
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error("Error fetching settings:", error);
        setMessage('Error loading settings.');
      }
    };
    fetchSettings();
  }, [navigate]);

  const handleSaveSettings = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      const response = await fetch('http://127.0.0.1:5000/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
        credentials: 'include'
      });
      if (response.status === 401) {
        navigate('/login');
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
      setMessage('Settings saved successfully!');
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage('Error saving settings.');
    }
  };

  const handleChange = (e) => {
    const { name, checked, value, type } = e.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-blue-400 text-center">Settings</h2>
        {message && <p className="text-center mb-4 text-green-400">{message}</p>}
        <form onSubmit={handleSaveSettings}>
          <div className="mb-4 flex items-center justify-between">
            <label htmlFor="dark_mode" className="text-lg">Dark Mode</label>
            <input
              type="checkbox"
              id="dark_mode"
              name="dark_mode"
              checked={settings.dark_mode}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </div>
          <div className="mb-6 flex items-center justify-between">
            <label htmlFor="safe_search" className="text-lg">Safe Search</label>
            <input
              type="checkbox"
              id="safe_search"
              name="safe_search"
              checked={settings.safe_search}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Settings
          </button>
        </form>
        <div className="mt-6 text-center">
            <button 
                onClick={() => navigate('/')} 
                className="text-gray-400 hover:text-gray-100 text-sm"
            >
                Back to Home
            </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
