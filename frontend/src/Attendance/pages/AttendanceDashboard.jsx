import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import "../styles/attendancedashboard.css";

import employeeIcon from "../icons/employee.png";
import AttendanceIcon from "../icons/attendance.png";
import LeaveIcon from "../icons/leave.png";
import addIcon from "../icons/add.png";

function Attendance() {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [attendanceCounts, setAttendanceCounts] = useState(null);
  const [jobRoleCounts, setJobRoleCounts] = useState([]);
  const backend_url=process.env.REACT_APP_MAIN_URL
  useEffect(() => {
    axios.get(backend_url+"/employee/count")
      .then((response) => setEmployeeCount(response.data.count))
      .catch((error) => console.error("Error fetching employee count:", error));

    axios.get(backend_url+"/employee/attendance-count")
      .then((response) => setAttendanceCounts(response.data))
      .catch((error) => console.error("Error fetching attendance count:", error));

    axios.get(backend_url+"/employee/jobrole-count")
      .then((response) => setJobRoleCounts(response.data))
      .catch((error) => console.error("Error fetching job role counts:", error));
  }, []);

  const pieChartData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        label: "Attendance",
        data: attendanceCounts ? [attendanceCounts.presentCount, attendanceCounts.absentCount] : [0, 0],
        backgroundColor: ["rgba(22, 160, 133)", "rgba(203, 75, 53)"],
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: jobRoleCounts.map((item) => item.jobrole),
    datasets: [
      {
        label: "Employee Count by Job Role",
        data: jobRoleCounts.map((item) => item.count),
        backgroundColor: [
          "rgba(54, 162, 235)",
          "rgba(75, 192, 192)",
          "rgba(153, 102, 255)",
          "rgba(255, 159, 64)",
          "rgba(255, 99, 132)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="emp-att-dashboard-container-view">
      <div className="main-content">
        <div className="emp-att-total-count mt-4">
          Total Employee Count: {employeeCount}
        </div>

        <div className="emp-att-tiles-container">
          <a href="/employee" className="emp-att-tile">
            <div className="emp-att-btn-tile">
              <img src={employeeIcon} alt="Employee Icon" />
              <span>Employee Details</span>
            </div>
          </a>
          <a href="/employee/add/attendance" className="emp-att-tile">
            <div className="emp-att-btn-tile">
              <img src={AttendanceIcon} alt="Attendance Icon" />
              <span>Add Attendance</span>
            </div>
          </a>
          <a href="/employee/attendance/details" className="emp-att-tile">
            <div className="emp-att-btn-tile">
              <img src={LeaveIcon} alt="Leave Icon" />
              <span>View Attendance</span>
            </div>
          </a>
          <a href="/employee/add" className="emp-att-tile">
            <div className="emp-att-btn-tile">
              <img src={addIcon} alt="Leave Icon" />
              <span>Add Employee</span>
            </div>
          </a>
        </div>

        <div className="emp-att-charts-section">
          <div className="emp-att-chart">
            <span>
              {attendanceCounts ? `Today's Attendance: Present - ${attendanceCounts.presentCount}, Absent - ${attendanceCounts.absentCount}` : "Attendance not marked yet"}
            </span>
            <Pie data={pieChartData} />
          </div>

          <div className="emp-att-chart">
            <span>Employee Count by Job Role</span>
            <Bar data={barChartData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attendance;
