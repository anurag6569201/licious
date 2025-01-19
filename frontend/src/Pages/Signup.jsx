import {
  Box,
  Button,
  Image,
  Input,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  SIGNUP_FAILURE,
  SIGNUP_SUCCESS,
  LOGIN_SUCCESS,
} from "../Redux/AuthRedux/actionType";
import { toastAlert } from "../Components/utils/action";
import "../Style/signup.css";
import signupSigninImg from "./Product Details/Images/signup_signin.png";

const Signup = ({ onClose }) => {
  const [isSignupForm, setIsSignupForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password1: "",
    password2: "",
  });
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const URL_MAIN = "http://127.0.0.1:8000";

  const toggleForm = () => {
    setIsSignupForm(!isSignupForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isSignupForm) {
      setFormData({ ...formData, [name]: value });
    } else {
      setLoginData({ ...loginData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (isSignupForm) {
      const { email, username, password1, password2 } = formData;

      if (!email || !username || !password1 || !password2) {
        toastAlert(toast, "All fields are required!", "warning");
        setLoading(false);
        return;
      }

      if (password1 !== password2) {
        toastAlert(toast, "Passwords do not match!", "error");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(`${URL_MAIN}/auth/registration/`, formData);
        
        if (response.status === 201) {
          toastAlert(toast, "Signup Successful!", "success");
          dispatch({ type: SIGNUP_SUCCESS, payload: response.data });
          onClose();
          navigate("/login");
        } else {
          throw new Error("Signup failed!");
        }
      } catch (error) {
        toastAlert(toast, error.response?.data?.detail || "Signup failed.", "error");
        dispatch({ type: SIGNUP_FAILURE, payload: error.response?.data });
      }
    } else {
      const { email, password } = loginData;

      if (!email || !password) {
        toastAlert(toast, "All fields are required!", "warning");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(`${URL_MAIN}/auth/login/`, loginData);
        
        if (response.status === 200) {
          localStorage.setItem("token", response.data.key);
          toastAlert(toast, "Login Successful!", "success");
          dispatch({ type: LOGIN_SUCCESS, payload: response.data });
          onClose();
          navigate("/");
        } else {
          throw new Error("Login failed!");
        }
      } catch (error) {
        toastAlert(toast, error.response?.data?.non_field_errors?.[0] || "Login failed.", "error");
      }
    }

    setLoading(false);
  };

  if (loading)
    return (
      <Stack className="signup_wrapper" style={{ width: "100%", justifyContent: "center", alignItems: "center", padding: "20px" }}>
        <Image width={"20%"} style={{ alignSelf: "center" }} src="https://acegif.com/wp-content/uploads/loading-29.gif" alt={"loading"} />
        <Text style={{ fontSize: "20px", fontWeight: 500, color: "#d11243", textAlign: "center" }}>Loading...</Text>
      </Stack>
    );

  return (
    <div className="image_wrapper_signup">
      <img src={signupSigninImg} alt="Signup" />
      <div className="signup_wrapper">
        {isSignupForm ? (
          <div className="input_wrapper">
            <Input variant="flushed" onChange={handleChange} name="email" type="email" placeholder="Enter Email Address" />
            <Input variant="flushed" onChange={handleChange} name="username" type="text" placeholder="Enter Username" />
            <Input variant="flushed" onChange={handleChange} name="password1" type="password" placeholder="Enter Password" />
            <Input variant="flushed" onChange={handleChange} name="password2" type="password" placeholder="Confirm Password" />
            <button onClick={handleSubmit} className="submit_btn">Sign Up</button>
            <div className="para_page" style={{ display: "flex", alignItems: "center" }}>
              <p>Already have an account?</p>
              <p style={{ cursor: "pointer", marginLeft: "5px" }} onClick={toggleForm}>Sign In</p>
            </div>
          </div>
        ) : (
          <div className="input_wrapper">
            <Input variant="flushed" onChange={handleChange} name="email" type="email" placeholder="Enter Email Address" />
            <Input variant="flushed" onChange={handleChange} name="password" type="password" placeholder="Enter Password" />
            <button onClick={handleSubmit} className="submit_btn">Sign In</button>
            <div className="para_page" style={{ display: "flex", alignItems: "center" }}>
              <p>Go to Signup page?</p>
              <p style={{ cursor: "pointer", marginLeft: "5px" }} onClick={toggleForm}>Signup</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
