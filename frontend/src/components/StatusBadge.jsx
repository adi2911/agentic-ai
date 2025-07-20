export default function StatusBadge({ status }) {
  const map = {
    uploaded: 'bg-gray-500',
    processing: 'bg-yellow-500',
    completed: 'bg-green-600',
    failed: 'bg-red-600'
  };

  const color = map[status] || 'bg-gray-500';

  return (
    <span
      className={`${color} text-white px-2 py-0.5 rounded text-xs capitalize`}
    >
      {status}
    </span>
  );
}
