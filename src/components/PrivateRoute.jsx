import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const user = true; 
  return user ? children : <Navigate to="/login" />;
}
