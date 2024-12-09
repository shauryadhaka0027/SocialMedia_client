import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRoute = () => {
    const checkValidate = JSON.parse(localStorage.getItem("userData"));

    // Add validation logic here if needed (e.g., check token expiry)
    const isAuthenticated = checkValidate !== null;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};
