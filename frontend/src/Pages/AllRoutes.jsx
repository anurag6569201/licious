import React from "react";
import { Route, Routes } from "react-router-dom";
import Checkout from './Checkout/Checkout';
import Home from './Home';
import Product from './Product';
import Profile from './Profile';
import Signup from './Signup';
import AboutDelicious from "./AboutDelicious";
import Certificate from "./Certificate";
import ProductDetails from "../Pages/Product Details/ProductDetails";

import Attendance from "../Attendance/pages/AttendanceDashboard";
import AddEmployee from "../Attendance/pages/AddEmployee";
import AllEmployeesDisplay from "../Attendance/pages/EmployeeDetails";
import AddEmployeeAttendance from "../Attendance/pages/AddEmployeeAttendance";
import AllEmployeeAttendance from "../Attendance/pages/AllEmployeeAttendance";

import PrivateRoute from './PrivateRoute';
import PrivateRouteDelivery from './PrivateRouteDelivery';
import InventoryManager from "../Attendance/pages/services/InventoryManager";
import OrderDetailsDelivery from "./Delivery";
import Last24HoursOrders from "./Chef_orders";

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
        <Route path="inventory" element={<PrivateRoute isAdmin={isAdmin}><InventoryManager /></PrivateRoute>} />

        <Route path='/delivery' element={<PrivateRouteDelivery><OrderDetailsDelivery /></PrivateRouteDelivery>} />
        <Route path='/show-orders' element={<Last24HoursOrders />} />
      </Routes>
    </div>
  );
};

export default AllRoutes;
