import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  // const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    emailOtp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEmailVerification = async () => {
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/sendLoginEmailVerification`,
        { email: formData.email }
      );

      if (res.data.success) {
        toast.success("Email verification code sent successfully");
      } else {
        toast.error("Failed to send email verification code");
      }
    } catch (error) {
      console.error(error);
      toast.error("User Not Registered");
    }
  };

  const confirmEmailVerification = async () => {
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/confirmEmail`,
        {
          email: formData.email,
          emailOtp: formData.emailOtp,
        }
      );

      if (res.data.success) {
        toast.success("Email verified successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Invalid OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.emailOtp) {
      toast.error("Please enter both email and phone OTPs");
      return;
    }

    try {
      const verifyEmailRes = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/confirmEmail`,
        {
          email: formData.email,
          emailOtp: formData.emailOtp,
        }
      );

      if (!verifyEmailRes.data.success) {
        toast.error("Email OTP verification failed");
        return;
      }

      const loginRes = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/login`,
        {
          email: formData.email,
        }
      );

      const userId = loginRes.data.uid;
      const userType = loginRes.data.user_type;

      secureLocalStorage.setItem("uid", userId);
      secureLocalStorage.setItem("user_type", userType);

      const encryptedUID = localStorage.getItem("@secure.n.uid");
      // const decryptedUserType = secureLocalStorage.getItem("user_type");

      // eslint-disable-next-line eqeqeq
      if (userType == 1) {
        navigate(`/admindashboard?uid=${encryptedUID}`);
        // eslint-disable-next-line eqeqeq
      } else if (userType == 2) {
        navigate(`/passengertrip?uid=${encryptedUID}`);
        // eslint-disable-next-line eqeqeq
      } else if (userType == 3) {
        navigate(`/driversdocumentverification?uid=${encryptedUID}`);
        // eslint-disable-next-line eqeqeq
      } else if (userType == 4) {
        navigate(`/vendorsdashboard?uid=${encryptedUID}`);
      }

      toast.success("Logged In Successfully");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred during login.");
      }
    }
  };

  return (
    <>
      <div className="container-fluid min-vh-100 ">
        <div className="row min-vh-100">
          <img
            className="object-fit-cover position-absolute z-n1 m-0 p-0"
            src="/Images/login&signup_image.png"
            alt=""
            style={{ height: "100%" }}
          />
          <div className="col-lg-6 m-0 p-0"></div>
          <div className="col-lg-6 m-0 p-0">
            <form
              className="bg-light login-container mx-auto rounded-4"
              onSubmit={handleSubmit}
            >
              <div className="text-center login-text pt-4 mx-auto mb-5">
                <h1 className="mb-3">Login</h1>
                <i>"Welcome to TRIPTO , Your trusted Travel Partner !!"</i>
              </div>
              <div className="form-container pb-4 mx-auto">
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <div className="input-group">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      id="email"
                      placeholder="name@gmail.com"
                      required
                      onChange={handleChange}
                      value={formData.email}
                    />
                    <button
                      className="btn btn-sm"
                      type="button"
                      style={{ backgroundColor: "#0bbfe0", color: "white" }}
                      onClick={handleEmailVerification}
                    >
                      Send OTP
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="emailOtp" className="form-label">
                    Email OTP:
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      id="emailOtp"
                      name="emailOtp"
                      className="form-control"
                      value={formData.emailOtp}
                      placeholder="Enter your OTP here"
                      onChange={handleChange}
                      required
                    />

                    <button
                      className="btn btn-sm"
                      style={{ backgroundColor: "#0bbfe0", color: "white" }}
                      type="button"
                      onClick={confirmEmailVerification}
                    >
                      Verify OTP
                    </button>
                  </div>
                </div>

                <br />
                <div className="row">
                  <div className="col-lg-6">
                    <input
                      className="btn px-4 py-2"
                      style={{ backgroundColor: "#0bbfe0", color: "white" }}
                      type="submit"
                      value="Login"
                    />
                  </div>
                </div>
              </div>
              <div className="text-center p-3 ">
                <Link className="text-decoration-none blue-text" to="/signup">
                  Don't Have An Account ? SignUp Here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
