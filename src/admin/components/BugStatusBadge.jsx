import React from "react";

const BugStatusBadge = ({ status }) => {
  const statusStyles = {
    PENDING: "bg-yellow-100 text-yellow-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    RESOLVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  const statusLabels = {
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved",
    REJECTED: "Rejected",
  };

  // Handle missing or invalid status
  const displayStatus = status && statusLabels[status] ? statusLabels[status] : "Unknown";
  const displayStyle = status && statusStyles[status] ? statusStyles[status] : "bg-gray-100 text-gray-800";

  return (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${displayStyle}`}
    >
      {displayStatus}
    </span>
  );
};

export default BugStatusBadge;