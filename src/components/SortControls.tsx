/* eslint-disable no-unused-vars */
import React from "react";
import { SortField, SortDirection } from "../types/Task";

interface SortControlsProps {
  sortField?: SortField;
  sortDirection?: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
}

export const SortControls: React.FC<SortControlsProps> = ({
  sortField,
  sortDirection,
  onSortChange,
}) => {
  const sortOptions: { field: SortField; label: string }[] = [
    { field: "username", label: "По имени" },
    { field: "email", label: "По email" },
    { field: "completed", label: "По статусу" },
  ];

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return "сортировать";
    }
    return sortDirection === "asc" ? "по возрастанию" : "по убыванию";
  };

  const handleSort = (field: SortField) => {
    let newDirection: SortDirection = "asc";

    if (sortField === field && sortDirection === "asc") {
      newDirection = "desc";
    }

    onSortChange(field, newDirection);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <span className="text-sm text-gray-600 self-center">Сортировка:</span>

      {sortOptions.map(({ field, label }) => (
        <button
          key={field}
          onClick={() => handleSort(field)}
          className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${
            sortField === field
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          {label}: {getSortIcon(field)}
        </button>
      ))}

      {(sortField || sortDirection) && (
        <button
          onClick={() => onSortChange("username", "asc")}
          className="px-3 py-1 rounded-md text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Сбросить
        </button>
      )}
    </div>
  );
};
