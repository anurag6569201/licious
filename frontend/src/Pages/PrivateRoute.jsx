import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ isAdmin, children }) => {
    return isAdmin ? children : <Navigate to="/" />;
};

export default PrivateRoute;
