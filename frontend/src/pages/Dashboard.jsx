import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { deleteCall, fetchCalls } from '../api/calls';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/useAuth';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ───────────────────────────────── Poll every 5 s
  useEffect(() => {
  let active = true;

  const load = async () => {
    try {
      if (active) setLoading(true);
      const res = await fetchCalls();      // ← hits GET /api/calls
      if (active) {
        setCalls(res.data);                // updates the table
        setError('');
      }
    } catch (err) {
      console.error(err)
      if (active) setError('Failed to fetch calls');
    } finally {
      if (active) setLoading(false);
    }
  };

  load();                                  // initial fetch
  const id = setInterval(load, 7000);      // ← **poll every 5 s**

  return () => {
    active = false;                        // guard against late updates
    clearInterval(id);                     // ← cleanup when component unmounts
  };
}, []);

  // ───────────────────────────────── JSX
  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="space-x-4">
          <span className="text-gray-700">{user?.email}</span>
          <button
            onClick={logout}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Upload button */}
      <Link
        to="/upload"
        className="inline-block mb-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Upload New Call
      </Link>

      {/* State handling */}
      {loading ? (
        <p className="text-center">Loading calls…</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : calls.length === 0 ? (
        <p className="text-gray-600">No calls uploaded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Filename</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created</th>
                <th className="p-3 w-40">Actions</th>
              </tr>
            </thead>

            <tbody>
              {calls.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="p-3">{c.filename}</td>

                  <td className="p-3">
                    <StatusBadge status={c.status} />
                  </td>

                  <td className="p-3">
                    {dayjs(c.createdAt).format('YYYY-MM-DD HH:mm')}
                  </td>

                  <td className="p-3 space-x-2">
                    <Link
                      to={
                        c.status === 'completed' ? `/calls/${c._id}` : '#'
                      }
                      className={`px-3 py-1 rounded text-white ${
                        c.status === 'completed'
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      View
                    </Link>

                    <button
  onClick={async () => {
    if (window.confirm(`Delete "${c.filename}"? This cannot be undone.`)) {
      try {
        await deleteCall(c._id);
        setCalls(prev => prev.filter(x => x._id !== c._id));
      } catch (e) {
        console.error(e)
        alert('Delete failed – please check the server log.');
      }
    }
  }}
  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
>
  Delete
</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
