export default function FactList({ facts = [] }) {
  if (!facts.length) return null;

  return (
    <ul className="mt-4 space-y-3 list-disc list-inside">
      {facts.map((f, i) => (
        <li
          key={i}
          className="p-3 bg-gray-50 rounded-lg shadow-sm text-gray-700 hover:bg-gray-100 transition"
        >
          {f}
        </li>
      ))}
    </ul>
  );
}
