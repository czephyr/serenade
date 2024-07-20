"use client";
import TimeAgo from "javascript-time-ago";
import it from "javascript-time-ago/locale/it";

import React, { useState, useEffect } from "react";

import StatusBadge from "@/components/statusBadge";
import genHue from "@/utils/hue";
import { formatDate } from "@/utils/dateUtils";

TimeAgo.addLocale(it);

const InstallationTable = ({ data }) => {
  const timeAgo = new TimeAgo("it-IT");
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortColumn, setSortColumn] = useState("date_delta"); // Default sort column
  const [sortedInstallations, setSortedInstallations] = useState(
    sortFunction(data, sortColumn, sortDirection)
  );

  const getSortIndicator = (column) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? "▲" : "▼";
    }
    return "▲▼";
  };

  function sortFunction(installations, column, direction) {
    return installations.sort((a, b) => {
      let aValue, bValue;

      switch (column) {
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "date":
          aValue = new Date(a.date_join);
          bValue = new Date(b.date_join);
          break;
        case "date_delta":
          aValue = a.date_delta;
          bValue = b.date_delta;
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
    setSortedInstallations([
      ...sortFunction(sortedInstallations, column, direction),
    ]);
  };

  useEffect(() => {
    console.log(sortFunction(data, sortColumn, sortDirection));
    setSortedInstallations(sortFunction(data, sortColumn, sortDirection));
  }, [data, sortColumn, sortDirection]);

  return (
    <main className="bg-gray-100 min-h-screen pt-10 pb-6 px-2 md:px-0">
      <div className="max-w-5xl mx-auto px-4 bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-2">Installazioni</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th
                  onClick={() => sortTable("name")}
                  className={`px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer text-gray-500`}
                >
                  Alias paziente
                </th>
                <th
                  onClick={() => sortTable("status")}
                  className={`px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer ${
                    sortColumn === "status" ? "text-black" : "text-gray-500"
                  }`}
                >
                  Stato {getSortIndicator("status")}
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
                  onClick={() => sortTable("date_delta")}
                  className={`px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer ${
                    sortColumn === "date_delta" ? "text-black" : "text-gray-500"
                  }`}
                >
                  Ultimo aggiornamento {getSortIndicator("date_delta")}
                </th>
                <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">
                  Dettagli
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedInstallations.map((installation) => (
                <tr key={installation.patient_id}>
                  <td className="px-5 py-5 border-b">
                    {genHue({ seed: installation.hue })}
                  </td>
                  <td className="px-5 py-5 border-b">
                    <StatusBadge status={installation.status} />
                  </td>
                  <td className="px-5 py-5 border-b">
                    {formatDate(installation.date_join)}
                  </td>
                  <td className="px-5 py-5 border-b">
                    {timeAgo.format(
                      Date.now() - installation.date_delta * 1000
                    )}
                  </td>
                  <td className="px-5 py-5 border-b">
                    <a
                      href={`/installations/${installation.patient_id}`}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default InstallationTable;
