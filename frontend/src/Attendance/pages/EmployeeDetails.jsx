import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import editIcon from "../icons/edit.png";
import deleteIcon from "../icons/delete.png";
import ViewMoreIcon from "../icons/chevron2.png";
import SearchIcon from "../icons/search2.png";

function AllEmployeesDisplay() {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/employee")
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching employees");
      });
  }, []);

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.nic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.jobrole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.contactNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this employee?`
    );
    
    if (confirmed) {
      try {
        const response = await axios.delete(
          `http://127.0.0.1:8000/employee/delete/${id}`,{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          }
        );
        if (response.status === 200) {
          setEmployees((prevEmployees) =>
            prevEmployees.filter((employee) => employee.id !== id)
          );
          alert("Employee deleted successfully");
        } else {
          console.error("Error deleting employee:", response.statusText);
          setError("Error deleting employee");
        }
      } catch (error) {
        console.error("Error deleting employee:", error.message);
        if (error.response) {
          console.error("Server response:", error.response.data);
        }
        setError("Error deleting employee");
      }
    }
  };

  return (
    <div className="container p-0" style={{width:'75%',marginTop:'100px'}}>
        <div className="card-header text-white">
          <h2 className="mb-0" style={{textAlign:'left',color:'black',fontSize:'1.6rem',fontWeight:'600'}}>Employee List</h2><br />
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Search and Actions */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="input-group" style={{ maxWidth: "400px" }}>
              <span className="input-group-text bg-light">
                <img
                  src={SearchIcon}
                  alt="Search"
                  style={{ width: "20px", height: "20px" }}
                />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search employees"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
            </div>
            <Link
              to="/view-more-employee"
              className="btn btn-secondary d-flex align-items-center"
            >
              <span>View More</span>
              <img
                src={ViewMoreIcon}
                alt="View More"
                style={{ width: "20px", height: "20px", marginLeft: "8px" }}
              />
            </Link>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-primary">
                <tr>
                  <th>Name</th>
                  <th>NIC</th>
                  <th>Email</th>
                  <th>Job Role</th>
                  <th>Contact Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.nic}>
                      <td>{employee.name}</td>
                      <td>{employee.nic}</td>
                      <td>{employee.email}</td>
                      <td>{employee.jobrole}</td>
                      <td>{employee.contactNumber}</td>
                      <td>
                        <button
                          className="btn btn-sm"
                          onClick={() => handleDelete(employee.id)}
                        >
                          <img
                            src={deleteIcon}
                            alt="Delete"
                            style={{ width: "16px", height: "16px" }}
                          />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}

export default AllEmployeesDisplay;
