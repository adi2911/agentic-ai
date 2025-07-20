import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchCall } from '../api/calls';
import StatusBadge from '../components/StatusBadge';

export default function CallDetail() {
  const { id } = useParams();
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCall(id);
        setCall(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load call');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <p className="p-6">Loading…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!call) return <p className="p-6">Call not found.</p>;

  return (
    <div className="p-6 space-y-6">
      <Link to="/" className="text-blue-700 underline">
        ← Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold truncate">{call.filename}</h1>
        <StatusBadge status={call.status} />
      </div>
      <p className="text-sm text-gray-600">
        Created: {dayjs(call.createdAt).format('YYYY-MM-DD HH:mm')}
      </p>

      {/* Transcript */}
      {call.transcript ? (
        <section>
          <h2 className="font-semibold mb-2">Transcript</h2>
          <div className="max-h-64 overflow-y-auto p-4 bg-gray-100 rounded whitespace-pre-wrap">
            {call.transcript.text}
          </div>
        </section>
      ) : (
        <p className="italic text-gray-500">Transcript not available.</p>
      )}

      {/* Metrics */}
      {call.analysis && (
        <section>
          <h2 className="font-semibold mb-2">Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(call.analysis.metrics).map(([k, v]) => (
              <div
                key={k}
                className="bg-white shadow p-4 rounded text-center space-y-2"
              >
                <div className="text-gray-500 text-sm capitalize">{k}</div>
                <div className="text-2xl font-bold">
                  {typeof v === 'number' ? v.toFixed(2) : v}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Coaching Plan */}
      {call.coachingPlan && (
        <section>
          <h2 className="font-semibold mb-2">Coaching Plan</h2>

          <details className="bg-white shadow rounded">
            <summary className="cursor-pointer py-3 px-4 font-medium">
              Recommendations ({call.coachingPlan.recommendations.length})
            </summary>
            <ul className="list-disc pl-8 pr-4 pb-4 space-y-1">
              {call.coachingPlan.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </details>

          <details className="bg-white shadow rounded mt-4">
            <summary className="cursor-pointer py-3 px-4 font-medium">
              Next Steps
            </summary>
            <p className="p-4">{call.coachingPlan.nextSteps}</p>
          </details>
        </section>
      )}
    </div>
  );
}
