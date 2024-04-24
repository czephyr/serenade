const StatusBadge = ({ status }) => {
  const statusStyles = {
    "in disinstallazione": "bg-gray-50 text-gray-600 ring-gray-500/10",
    "in manutenzione": "bg-red-50 text-red-700 ring-red-600/10",
    inattivo: "bg-black-50 text-black-800 ring-black-600/20",
    attivo: "bg-green-50 text-green-700 ring-green-600/20",
    "in installazione": "bg-orange-50 text-orange-700 ring-orange-600/20",
  };

  // Default to a gray badge if the status is unrecognized
  const style =
    statusStyles[status.toLowerCase()] ||
    "bg-gray-50 text-gray-600 ring-gray-500/10";

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${style} ring-1 ring-inset`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
