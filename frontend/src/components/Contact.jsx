import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Feed() {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const data = await api.getContacts();
        setContacts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    loadContacts();
  }, []);

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
            <div key={contact.id} className="bg-white border rounded p-4 shadow-sm">
              <p className="font-semibold text-lg">{contact.name}</p>
              <p className="text-sm text-gray-700">Phone: {contact.phone}</p>
              <p className="text-sm text-gray-700">
                Email: {contact.email || 'N/A'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}