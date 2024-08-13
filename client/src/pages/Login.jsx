import React, { useEffect, useState } from "react";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import GoogleSvg from "../assets/icons8-google.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl } from "../service/consts";
import { FaSignInAlt } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    let username = e.target.username.value;
    let password = e.target.password.value;

    if (username.length > 0 && password.length > 0) {
      const formData = {
        username,
        password,
      };
      try {
        const response = await axios.post(
          `${baseUrl}/login`,
          formData
        );
        localStorage.setItem('auth', JSON.stringify(response.data.token));
        toast.success("Login successfull");
        navigate("/home");
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      toast.error("Please fill all inputs");
    }
  };

  useEffect(() => {
    if (token !== "") {
      toast.success("You already logged in");
      navigate("/home");
    }
  }, []);

  return (
    <div className="login-main">
      <div className="login-left">
        <img src={Image} alt="" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          {/* <div className="login-logo">
            <img src={Logo} alt="" />
          </div> */}
          <div className="login-center">
            <p>Please enter your details</p>
            <form onSubmit={handleLoginSubmit}>
              <input type="text" placeholder="Username" name="username" />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                />
                {showPassword ? (
                  <FaEyeSlash
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                ) : (
                  <FaEye
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                )}
              </div>

              <div className="login-center-options">
                <div className="remember-div">
                  <input type="checkbox" id="remember-checkbox" />
                  <label htmlFor="remember-checkbox">Remember for 30 days</label>
                </div>
                {/* <a href="#" className="forgot-pass-link">
                  Forgot password?
                </a> */}
              </div>
              <div className="login-center-buttons">
                <button className="btn btn-dark py-3"><FaSignInAlt /> LogIn</button>
                {/* <button type="submit">
                  <img src={GoogleSvg} alt="" />
                  Log In with Google
                </button> */}
              </div>
            </form>
          </div>

          <p className="login-bottom-p">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
