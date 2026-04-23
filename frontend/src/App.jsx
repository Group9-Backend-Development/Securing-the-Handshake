import { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Feed from './components/Contact';
import AddContact from './components/AddContact';
import { api } from './api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [view, setView] = useState('contacts');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const checkSession = async () => {
      try {
        await api.checkAuth();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsInitialLoad(false);
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      const csrfToken = await api.getCsrfToken();
      await api.logout(csrfToken);
      setIsAuthenticated(false);
      setView('contacts');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const handleAddSuccess = () => {
    setView('contacts');
    setRefreshKey((prev) => prev + 1);
  };

  if (isInitialLoad) {
    return <div className="min-h-screen flex items-center justify-center">Loading session...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 min-h-screen pt-20">
        <Auth onAuthSuccess={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <nav className="bg-white border-b border-gray-300 sticky top-0 z-10 h-16 flex items-center">
        <div className="max-w-4xl mx-auto w-full flex justify-between px-4 items-center">
          <h1 className="text-xl font-bold cursor-pointer" onClick={() => setView('contacts')}>
            Phone Book
          </h1>

          <div className="flex gap-4 items-center">
            <button
              onClick={() => setView('contacts')}
              className={`text-sm font-semibold ${view === 'contacts' ? 'text-black' : 'text-gray-400'}`}
            >
              Contacts
            </button>

            <button
              onClick={() => setView('add')}
              className={`text-sm font-semibold ${view === 'add' ? 'text-black' : 'text-gray-400'}`}
            >
              Add Contact
            </button>

            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 pt-4">
        {view === 'contacts' ? (
          <Feed key={refreshKey} />
        ) : (
          <AddContact onUploadSuccess={handleAddSuccess} />
        )}
      </main>
    </div>
  );
}

export default App;