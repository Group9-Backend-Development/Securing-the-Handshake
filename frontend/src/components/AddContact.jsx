import { useState, useEffect } from 'react';
import { api } from '../api';

export default function Upload({ onUploadSuccess }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCsrf = async () => {
      try {
        const token = await api.getCsrfToken();
        setCsrfToken(token);
      } catch {
        setError('Failed to load CSRF token');
      }
    };

    fetchCsrf();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !phone) {
      setError('Name and phone are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.addContact({ name, phone }, csrfToken);
      setName('');
      setPhone('');
      onUploadSuccess();
    } catch (err) {
      setError(err.message);

      try {
        const newToken = await api.getCsrfToken();
        setCsrfToken(newToken);
      } catch {
        setError('Request failed and token refresh failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 bg-white border border-gray-300 p-6 rounded shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-center">Add Contact</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded p-2 text-sm"
          required
        />

        <input
          type="text"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border rounded p-2 text-sm"
          required
        />

        <input
          type="email"
          placeholder="Email address (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded p-2 text-sm"
        />

        <button
          type="submit"
          disabled={loading || !csrfToken}
          className="bg-blue-500 text-white py-2 rounded font-semibold text-sm hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Add Contact'}
        </button>
      </form>

      {error && <p className="text-red-500 text-xs mt-4 text-center">{error}</p>}
    </div>
  );
}