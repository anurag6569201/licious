import React, { useState } from "react";
import axios from "axios";
import '../styles/employee.css';

function AddEmployee() {
  const [name, setName] = useState("");
  const [nic, setNIC] = useState("");
  const [aadhaarImage, setAadhaarImage] = useState(null);
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [jobrole, setJobRole] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [errors, setErrors] = useState({});

  const backend_url = process.env.REACT_APP_MAIN_URL;

  function sendData(e) {
    e.preventDefault();

    const errors = {};
    if (!name) errors.name = "Name is required";
    else if (!/^[a-zA-Z ]+$/.test(name)) errors.name = "Name should only contain letters";
    if (!nic) errors.nic = "NIC is required";
    else if (nic.length < 10 || nic.length > 12) errors.nic = "NIC must be between 10 and 12 characters";
    if (!contactNumber) errors.contactNumber = "Contact number is required";
    else if (contactNumber.length < 10 || contactNumber.length > 15) errors.contactNumber = "Contact number must be between 10 and 15 digits";
    if (!gender) errors.gender = "Gender is required";
    if (!age) errors.age = "Age is required";
    else if (isNaN(age) || age < 18 || age > 100) errors.age = "Age must be a number between 18 and 100";
    if (!address) errors.address = "Address is required";
    if (!jobrole) errors.jobrole = "Job role is required";
    if (!qualifications) errors.qualifications = "Qualifications are required";
    if (!aadhaarImage) errors.aadhaarImage = "Aadhaar image is required";

    setErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("nic", nic);
    formData.append("aadhaarImage", aadhaarImage);
    formData.append("email", email);
    formData.append("contactNumber", contactNumber);
    formData.append("gender", gender);
    formData.append("age", age);
    formData.append("address", address);
    formData.append("jobrole", jobrole);
    formData.append("qualifications", qualifications);

    axios
      .post(`${backend_url}/employee/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        alert("New employee added");
      })
      .catch((err) => {
        alert(err);
      });
  }


  return (
    <div className="container my-5 pt-5">
      <div className="">
        <div className="card-body">
          <h2 className="text-center mb-4 add_employee_heading">Add New Employee</h2>
          <form onSubmit={sendData}>
            <div className="row add_employee_form">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Employee Full Name:
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    id="name"
                    placeholder="Enter Employee Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="nic" className="form-label">
                    Aadhaar Number:
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.nic ? "is-invalid" : ""}`}
                    id="nic"
                    placeholder="Enter Aadhaar Number"
                    value={nic}
                    onChange={(e) => setNIC(e.target.value)}
                  />
                  {errors.nic && <div className="invalid-feedback">{errors.nic}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Employee Email (*Optional):
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter Employee Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="gender" className="form-label">
                    Gender:
                  </label>
                  <select
                    className={`form-select ${errors.gender ? "is-invalid" : ""}`}
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="age" className="form-label">
                    Age:
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.age ? "is-invalid" : ""}`}
                    id="age"
                    placeholder="Enter Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                  {errors.age && <div className="invalid-feedback">{errors.age}</div>}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="contactNumber" className="form-label">
                    Contact Number:
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.contactNumber ? "is-invalid" : ""}`}
                    id="contactNumber"
                    placeholder="Enter Contact Number"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                  {errors.contactNumber && <div className="invalid-feedback">{errors.contactNumber}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="aadhaarImage" className="form-label">Upload Aadhaar Image :</label>
                  <input
                    type="file"
                    className={`form-control ${errors.aadhaarImage ? "is-invalid" : ""}`}
                    id="aadhaarImage"
                    accept="image/*"
                    onChange={(e) => setAadhaarImage(e.target.files[0])}
                  />
                  {errors.aadhaarImage && <div className="invalid-feedback">{errors.aadhaarImage}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    Address:
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.address ? "is-invalid" : ""}`}
                    id="address"
                    placeholder="Enter Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="jobrole" className="form-label">
                    Job Role:
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.jobrole ? "is-invalid" : ""}`}
                    id="jobrole"
                    placeholder="Enter Job Role"
                    value={jobrole}
                    onChange={(e) => setJobRole(e.target.value)}
                  />
                  {errors.jobrole && <div className="invalid-feedback">{errors.jobrole}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="qualifications" className="form-label">
                    Qualifications:
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.qualifications ? "is-invalid" : ""}`}
                    id="qualifications"
                    placeholder="Enter Qualifications"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                  />
                  {errors.qualifications && <div className="invalid-feedback">{errors.qualifications}</div>}
                </div>
              </div>
            </div>
            <div className="text-center" style={{display: "flex", justifyContent: "left"}}>
              <button type="submit" className="btn btn-primary px-5">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEmployee;
