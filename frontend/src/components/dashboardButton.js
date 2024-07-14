"use client";

const DashboardButton = ({ installation_id }) => {
  return (
    <main>
      <div className="max-w-5xl mx-auto px-4 bg-white shadow rounded-lg p-6">
        <h1 className="text-lg font-bold leading-tight mb-4">Dashboard</h1>
        <div className="space-y-6 text-black">
          <div className="grid grid-cols-1 gap-1">
            <a
              href={`/patients/${installation_id}/data`} // Modify this URL as needed for your routing
              className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline no-underline"
              role="button"
              aria-label="View Data"
            >
              Accedi ai dati
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardButton;
