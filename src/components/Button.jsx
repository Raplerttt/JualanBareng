import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ text, onClick, type, size, disabled }) => {
  const baseClasses =
    'rounded focus:outline-none focus:ring transition duration-300 font-medium';

  const typeClasses = {
    login: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300',
    register: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-300',
    showMore: 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-300',
    add: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-300',
    item: 'bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-indigo-300',
    order: 'bg-purple-500 text-white hover:bg-purple-600 focus:ring-purple-300',
    save: 'bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-300',
  };

  const sizeClasses = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-5 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${typeClasses[type]} ${
        sizeClasses[size]
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['login', 'register', 'showMore', 'add', 'item', 'order', 'save']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  onClick: () => {},
  type: 'login',
  size: 'medium',
  disabled: false,
};

export default Button;
