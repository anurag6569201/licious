import React from "react";
import { Route, Routes } from "react-router-dom";
import Checkout from './Checkout/Checkout';
import Home from './Home';
import Product from './Product';
import Profile from './Profile';
import Signup from './Signup';
import AboutDelicious from "./AboutDelicious";
import Certificate from "./Certificate";
import ProductDetails from "../Pages/Product Details/ProductDetails"

import Attendance from "../Attendance/pages/AttendanceDashboard";
import AddEmployee from "../Attendance/pages/AddEmployee";
import AllEmployeesDisplay from "../Attendance/pages/EmployeeDetails";
import AddEmployeeAttendance from "../Attendance/pages/AddEmployeeAttendance";
import AllEmployeeAttendance from "../Attendance/pages/AllEmployeeAttendance";

import PrivateRoute from './PrivateRoute';
import InventoryManagement from "../Attendance/pages/Inventory";
const isAdmin = localStorage.getItem("isAdmin") === "true";

const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/product/:id' element={<Product />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path="/certificate" element={<Certificate />} />
        <Route path="/aboutDelicious" element={<AboutDelicious />} />
        <Route path="/productdetails/:id" element={<ProductDetails />} />


        {/* Attendance Routes */}
        <Route path="/attendance" element={<PrivateRoute isAdmin={isAdmin}><Attendance /></PrivateRoute>} />
        <Route path="/employee/add" element={<PrivateRoute isAdmin={isAdmin}><AddEmployee /></PrivateRoute>} />
        <Route path="/employee/add/attendance" element={<PrivateRoute isAdmin={isAdmin}><AddEmployeeAttendance /></PrivateRoute>} />
        <Route path="/employee" element={<PrivateRoute isAdmin={isAdmin}><AllEmployeesDisplay /></PrivateRoute>} />
        <Route path="/employee/attendance/details" element={<PrivateRoute isAdmin={isAdmin}><AllEmployeeAttendance /></PrivateRoute>} />
        <Route path="inventory/add" element={<PrivateRoute isAdmin={isAdmin}><InventoryManagement /></PrivateRoute>} />
      </Routes>
    </div>
  );
};

export default AllRoutes;
