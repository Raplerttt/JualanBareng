import React from 'react';
import PropTypes from 'prop-types';

const Main = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#091057] flex-col">
      {/* Main Content */}
      <main className="flex-1 px-6 py-4">{children}</main>
    </div>
  );
};

Main.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Main;
