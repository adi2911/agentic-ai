import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadCall } from '../api/calls';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please choose an audio file.');
    setError('');
    setProgress(0);
    setResult(null);

    try {
      const data = await uploadCall(file, (evt) =>
        setProgress(Math.round((evt.loaded * 100) / evt.total))
      );
      setResult(data); // { id, status }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Upload failed');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Upload a Call Recording</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files[0] || null)}
          className="w-full file:rounded file:border-0 file:bg-blue-600 file:text-white
                     file:px-4 file:py-2 file:mr-3 file:cursor-pointer"
        />

        {progress > 0 && progress < 100 && (
          <div className="w-full bg-gray-200 rounded h-3">
            <div
              style={{ width: `${progress}%` }}
              className="h-3 bg-blue-600 rounded"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
          disabled={!file}
        >
          Upload
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {result && (
        <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded">
          <p className="font-medium">✅ Upload complete!</p>
          <p>
            Call&nbsp;ID:&nbsp;
            <span className="font-mono bg-white px-1 py-0.5 rounded">
              {result.id}
            </span>
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-2 text-blue-700 underline"
          >
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
