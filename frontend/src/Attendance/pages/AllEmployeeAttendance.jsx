import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import SearchIcon from '../icons/search2.png';

function AllEmployeeAttendance() {
    const [attendanceDetails, setAttendanceDetails] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState(null);
    const editFormRef = useRef(null);
    const backend_url = process.env.REACT_APP_MAIN_URL;

    useEffect(() => {
        fetchData(filterDate);
    }, [filterDate]);

    const fetchData = async (date) => {
        try {
            const response = await axios.get(`${backend_url}/attendance-list?date=${date}`);
            const formattedAttendanceDetails = response.data.map(attendance => ({
                ...attendance,
                date: new Date(attendance.date).toISOString().split('T')[0]
            }));
            setAttendanceDetails(formattedAttendanceDetails);
        } catch (error) {
            console.error('Error fetching attendance details:', error);
            setError("Error fetching attendance details");
        }
    };

    const filteredAttendance = attendanceDetails.filter(attendance => (
        attendance.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendance.employee.nic.toString().includes(searchQuery.toLowerCase()) ||
        attendance.employee.jobrole.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendance.day_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendance.attendance.toLowerCase().includes(searchQuery.toLowerCase())
    ));

    return (
        <div className="emp-att-background-container">
            <div className="emp-att-container mt-3" style={{ paddingBottom: "20px", paddingTop: "10px",width:'75%' }}>
                <h1 style={{fontSize:'2rem',fontWeight:'700',textAlign:'left',marginBottom:'20px',marginTop:'20px'}}>All Attendance Details</h1>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="input-group mb-4" style={{ width: "300px" }}>
                        <span className="input-group-text">
                            <img src={SearchIcon} alt="Search" style={{ width: '20px', height: '20px' }} />
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search attendance details"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="mb-4" style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '10px', fontWeight: 'bold' }}>Filter By Date:</span>
                        <div className="input-group" style={{ width: "300px" }}>
                            <input
                                type="date"
                                className="form-control"
                                value={filterDate}
                                onChange={e => setFilterDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mb-4" style={{ marginLeft: '20px' }}>
                        <Link to="/attendance-report" className="emp-att-btn-primary" style={{ width: '200px', display: 'flex', alignItems: 'center', fontWeight: 'bold', textDecoration: 'none', marginRight: '30px' }}>
                            Attendance Report
                        </Link>
                    </div>
                </div>
                <table className="table mt-3">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Aadhaar Number</th>
                            <th>Job Role</th>
                            <th>Day Type</th>
                            <th>Date</th>
                            <th>Attendance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAttendance.length > 0 ? (
                            filteredAttendance.map(record => (
                                <tr key={record.id}>
                                    <td>{record.employee.name}</td>
                                    <td>{record.employee.nic}</td>
                                    <td>{record.employee.jobrole}</td>
                                    <td>{record.day_type}</td>
                                    <td>{record.date}</td>
                                    <td>{record.attendance}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No attendance taken yet</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AllEmployeeAttendance;
