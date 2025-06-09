import React from 'react';
import PropTypes from 'prop-types';

const FraudStatusBadge = ({ status }) => {
  const statusStyles = {
    open: 'bg-red-100 text-red-800',
    investigating: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
  };

  const statusLabels = {
    open: 'Open',
    investigating: 'Investigating',
    resolved: 'Resolved',
    closed: 'Closed',
  };

  // Jika status tidak ada di daftar, beri default
  const badgeStyle = statusStyles[status] || 'bg-gray-100 text-gray-800';
  const label = statusLabels[status] || 'Unknown';

  return (
    <span
      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeStyle}`}
    >
      {label}
    </span>
  );
};

FraudStatusBadge.propTypes = {
  status: PropTypes.oneOf(['open', 'investigating', 'resolved', 'closed']).isRequired,
};

export default FraudStatusBadge;
