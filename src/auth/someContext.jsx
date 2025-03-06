import React, { useContext } from 'react';
import { AuthContext } from './auth/authContext';

const SomeComponent = () => {
  const { user, login, logout } = useContext(AuthContext);

  return (
    <div>
      {user ? (
        <div>
          <p>Selamat datang, {user.fullName}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => login({ fullName: 'John Doe', email: 'john@example.com' })}>
          Login
        </button>
      )}
    </div>
  );
};