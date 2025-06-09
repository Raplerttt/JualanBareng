import React from 'react';
import PropTypes from 'prop-types';

const Main = ({ children, className = '' }) => {
  return (
    <main className={`min-h-screen bg-white flex flex-col ${className}`}>
      {/* Main Content - grows to fill available space */}
      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-9xl mx-auto w-full">
        {children}
      </div>
    </main>
  );
};

Main.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string, // for additional styling if needed
};

export default Main;