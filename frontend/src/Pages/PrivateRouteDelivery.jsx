import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const PrivateRouteDelivery = ({ children, requiredPermission }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const token = localStorage.getItem("token"); // Retrieve token from local storage or context

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/delivery-check/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.delivery_person) {
          setHasPermission(true);
        } else {
          setHasPermission(false);
        }
      } catch (error) {
        setHasPermission(false);
      }
    };

    if (token) {
      checkPermission();
    } else {
      setHasPermission(false);
    }
  }, [token]);

  if (hasPermission === null) {
    return <div>Loading...</div>; // Show a loading state while checking
  }

  if (!hasPermission) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRouteDelivery;
