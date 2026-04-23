import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Feed() {
  const [contacts, setContacts] = useState([]);
  const [csrfToken, setCsrfToken] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [data, token] = await Promise.all([
          api.getContacts(),
          api.getCsrfToken(),
        ]);
        setContacts(data);
        setCsrfToken(token);
      } catch (err) {
        setError(err.message);
      }
    };

    loadData();
  }, []);

  const handleDelete = async (contactId) => {
    setDeletingId(contactId);
    setError('');

    try {
      const token = csrfToken || await api.getCsrfToken();
      if (!csrfToken) {
        setCsrfToken(token);
      }

      await api.deleteContact(contactId, token);
      setContacts((currentContacts) =>
        currentContacts.filter((contact) => contact.id !== contactId)
      );
    } catch (err) {
      setError(err.message);

      try {
        const newToken = await api.getCsrfToken();
        setCsrfToken(newToken);
      } catch {
        setError('Delete failed and token refresh failed');
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">Contact List</h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {contacts.length === 0 ? (
        <div className="bg-white border rounded p-4 text-gray-500">
          No contacts yet.
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="bg-white border rounded p-4 shadow-sm flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-lg">{contact.username}</p>
                <p className="text-sm text-gray-700">Phone: {contact.phonenumber}</p>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(contact.id)}
                disabled={deletingId === contact.id || !csrfToken}
                className="bg-red-500 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-red-600 disabled:opacity-50"
              >
                {deletingId === contact.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
