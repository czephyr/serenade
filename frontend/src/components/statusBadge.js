const StatusBadge = ({ status }) => {
  const installationStatusStyles = {
    "in installazione": "bg-orange-50 text-orange-700 ring-orange-600/20",
    attivo: "bg-green-50 text-green-700 ring-green-600/20",
    "in manutenzione": "bg-red-50 text-red-700 ring-red-600/10",
    "in disinstallazione": "bg-gray-50 text-gray-600 ring-gray-500/10",
    inattivo: "bg-black-50 text-black-800 ring-black-600/20",
    "stato sconosciuto": "bg-gray-50 text-gray-600 ring-gray-500/10", // Default for unknown installation status
  };

  const ticketStatusStyles = {
    aperto: "bg-blue-50 text-blue-700 ring-blue-600/20",
    chiuso: "bg-red-50 text-red-700 ring-red-600/10",
  };

  // Lowercase the status to ensure case insensitivity
  const lowerStatus = status.toLowerCase();

  // Determine which style set to use based on status
  const style =
    installationStatusStyles[lowerStatus] ||
    ticketStatusStyles[lowerStatus] ||
    "bg-gray-50 text-gray-600 ring-gray-500/10"; // Default if none match

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${style} ring-1 ring-inset`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
