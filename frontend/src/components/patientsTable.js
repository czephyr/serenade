"use client";

import Cookies from "js-cookie";

import React, { useState, useEffect } from "react";
import StatusBadge from "@/components/statusBadge";
import { formatDate } from "@/utils/dateUtils";

const PatientsTable = ({ data }) => {
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortColumn, setSortColumn] = useState("date"); // Default sort column
  const [sortedPatients, setSortedPatients] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const defaultSortColumn = Cookies.get("sortColumn") || "date";
    const defaultSortDirection = Cookies.get("sortDirection") || "asc";

    setSortColumn(defaultSortColumn);
    setSortDirection(defaultSortDirection);
    setSortedPatients(
      sortFunction(data, defaultSortColumn, defaultSortDirection)
    );
    setIsClient(true);
  }, [data]);

  const getSortIndicator = (column) => {
    if (!isClient) return ""; // Avoid mismatch during SSR
    if (sortColumn === column) {
      return sortDirection === "asc" ? "▲" : "▼";
    }
    return "▲▼";
  };

  function sortFunction(items, column, direction) {
    return items.sort((a, b) => {
      let aValue, bValue;

      switch (column) {
        case "nome":
          aValue = a.first_name.toLowerCase();
          bValue = b.first_name.toLowerCase();
          break;
        case "cognome":
          aValue = a.last_name.toLowerCase();
          bValue = b.last_name.toLowerCase();
          break;
        case "categoria":
          aValue = a.neuro_diag.toLowerCase();
          bValue = b.neuro_diag.toLowerCase();
          break;
        case "date":
          aValue = new Date(a.date_join);
          bValue = new Date(b.date_join);
          break;
        case "status":
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      } else if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  const sortTable = (column) => {
    const direction =
      sortColumn === column
        ? sortDirection === "asc"
          ? "desc"
          : "asc"
        : "asc";
    setSortDirection(direction);
    setSortColumn(column);
    setSortedPatients([...sortFunction(sortedPatients, column, direction)]);

    // Save sort settings in cookies
    Cookies.set("sortColumn", column);
    Cookies.set("sortDirection", direction);
  };

  useEffect(() => {
    setSortedPatients(sortFunction(data, sortColumn, sortDirection));
  }, [data, sortColumn, sortDirection]);

  return (
    <main className="bg-gray-100 min-h-screen pt-10 pb-6 px-2 md:px-0">
      <div className="max-w-5xl mx-auto px-4 bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-2">Pazienti</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th
                  onClick={() => sortTable("nome")}
                  className={`px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer ${
                    sortColumn === "nome" ? "text-black" : "text-gray-500"
                  }`}
                >
                  Nome {getSortIndicator("nome")}
                </th>
                <th
                  onClick={() => sortTable("cognome")}
                  className={`px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer ${
                    sortColumn === "cognome" ? "text-black" : "text-gray-500"
                  }`}
                >
                  Cognome {getSortIndicator("cognome")}
                </th>
                <th
                  onClick={() => sortTable("categoria")}
                  className={`px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer ${
                    sortColumn === "categoria" ? "text-black" : "text-gray-500"
                  }`}
                >
                  Categoria {getSortIndicator("categoria")}
                </th>

                <th
                  onClick={() => sortTable("date")}
                  className={`px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer ${
                    sortColumn === "date" ? "text-black" : "text-gray-500"
                  }`}
                >
                  Arruolamento {getSortIndicator("date")}
                </th>
                <th
                  onClick={() => sortTable("status")}
                  className={`px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer ${
                    sortColumn === "status" ? "text-black" : "text-gray-500"
                  }`}
                >
                  Status {getSortIndicator("status")}
                </th>
                <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                  Dettagli
                </th>
                <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                  Dati
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPatients.map((patient) => (
                <tr key={patient.patient_id}>
                  <td className="px-5 py-5 border-b">{patient.first_name}</td>
                  <td className="px-5 py-5 border-b">{patient.last_name}</td>
                  <td className="px-5 py-5 border-b">{patient.neuro_diag}</td>
                  <td className="px-5 py-5 border-b">
                    {formatDate(patient.date_join)}
                  </td>
                  <td className="px-5 py-5 border-b">
                    <StatusBadge status={patient.status} />
                  </td>
                  <td className="px-5 py-5 border-b">
                    <a
                      href={`/patients/${patient.patient_id}`}
                      className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      role="button"
                    >
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
                          d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
                        />
                      </svg>
                    </a>
                  </td>
                  <td className="px-5 py-5 border-b">
                    <a
                      href={`/patients/${patient.patient_id}/data`} // Modify this URL as needed for your routing
                      className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      role="button"
                      aria-label="View Data"
                    >
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <a
            href="/patients/create"
            className="inline-flex items-center justify-center mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            role="button"
          >
            Aggiungi nuovo paziente
          </a>
        </div>
      </div>
    </main>
  );
};

export default PatientsTable;
