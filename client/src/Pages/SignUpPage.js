import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../API/axiosInstance";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showUserTypePopup, setShowUserTypePopup] = useState(true);
  const [selectedUserType, setSelectedUserType] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    emailOtp: "",
    // phoneOtp: "",
    user_type: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleEmailVerification = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/auth/sendEmailVerification`,
        { email: formData.email }
      );

      if (res.data.success) {
        toast.success("Email verification code sent successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while sending email verification code");
    }
  };

  const confirmEmailVerification = async () => {
    try {
      const res = await axios.post(
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

  // const handlePhoneVerification = async () => {
  //   try {
  //     const res = await axios.post(
  //       `${process.env.REACT_APP_BASE_URL}/auth/sendPhoneVerification`,
  //       { phone: formData.phone_number }
  //     );

  //     if (res.data.success) {
  //       alert("Phone verification code sent successfully");
  //     } else {
  //       setErrorMessage("Failed to send phone verification code");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setErrorMessage(
  //       "An error occurred while sending phone verification code"
  //     );
  //   }
  // };

  const handleUserTypeSelection = (userType) => {
    setSelectedUserType(userType);
    setFormData((prevState) => ({ ...prevState, user_type: userType }));
    setShowUserTypePopup(false);
  };

  const handleSignupWithVerification = async (e) => {
    e.preventDefault();

    if (!formData.emailOtp) {
      toast.error("Please enter email OTPs");
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

      if (!/^\d{10}$/.test(formData.phone_number)) {
        toast.error("Phone number must be exactly 10 digits");
        return;
      }
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/signup_with_verification`,
        formData
      );

      toast.success("Signed Up Successfully");
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error(error.response.data.error);
      }
    }
  };

  return (
    <>
      <div className="container-fluid min-vh-100">
        <div className="row min-vh-100">
          <img
            className="object-fit-cover position-absolute z-n1 m-0 p-0"
            src="/Images/login&signup_image.png"
            alt=""
            style={{ height: "100vh" }}
          />
          {showUserTypePopup && (
            <div className="user-type-overlay">
              <div className="user-type-popup">
                <h3>Select User Type</h3>
                <div className="user-type-options row text-center">
                  <div
                    className="user-type-option col-lg-6"
                    onClick={() => handleUserTypeSelection(2)}
                  >
                    <div className="card" style={{ width: "18rem" }}>
                      <img
                        src="/Images/avatar (3).png"
                        className="card-img-top img-fluid"
                        alt=""
                      />
                      <div className="card-body">
                        <p className="card-text">Passenger</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="user-type-option col-lg-6"
                    onClick={() => handleUserTypeSelection(3)}
                  >
                    <div className="card" style={{ width: "18rem" }}>
                      <img
                        src="/Images/avatar (1).jpeg"
                        className="card-img-top img-fluid"
                        alt=""
                      />
                      <div className="card-body">
                        <p className="card-text">Driver</p>
                      </div>
                    </div>
                  </div>
                  {/* <div
                    className="user-type-option col-lg-4"
                    onClick={() => handleUserTypeSelection("Vendor")}
                  >
                    <div className="card" style={{ width: "18rem" }}>
                      <img
                        src="/Images/avatar (2).jpeg"
                        className="card-img-top img-fluid"
                        alt=""
                      />
                      <div className="card-body">
                        <p className="card-text">Vendor</p>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          )}
          <div className="col-lg-6 m-0 p-0"></div>
          <div className="col-lg-6 m-0 p-0">
            <form
              className="bg-light signup-container mx-auto rounded-4"
              onSubmit={handleSignupWithVerification}
            >
              <div className="text-center signup-text pt-4 mx-auto mb-5">
                <h1 className="mb-3">Sign Up</h1>
                <i>"Welcome to TRIPTO , Your trusted Travel Partner !!"</i>
              </div>
              <div className="form-container pb-4 mx-auto">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        id="name"
                        placeholder="Enter Your Name"
                        required
                        onChange={handleChange}
                        value={formData.name}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 mb-3">
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
                  <div className="col-lg-6 mb-3">
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
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label htmlFor="phone_number" className="form-label">
                        Phone Number
                      </label>
                      <input
                        type="number"
                        name="phone_number"
                        className="form-control"
                        id="phone_number"
                        placeholder="Enter your phone number"
                        onChange={handleChange}
                        value={formData.phone_number}
                        required
                      />
                      {/* <button
                    className="btn btn-outline-secondary"
                    type="button"
                    // onClick={handlePhoneVerification}
                  >
                    Send Phone OTP
                  </button> */}
                    </div>
                  </div>
                </div>

                {/* <div className="mb-3">
                  <label htmlFor="phoneOtp" className="form-label">
                    Phone OTP:
                  </label>
                  <input
                    type="text"
                    id="phoneOtp"
                    name="phoneOtp"
                    className="form-control"
                    value={formData.phoneOtp}
                    placeholder="Enter your phone OTP here"
                    onChange={handleChange}
                    required
                  />
                </div> */}

                <br />

                <input
                  className="btn px-4 py-2"
                  style={{ backgroundColor: "#0bbfe0", color: "white" }}
                  type="submit"
                  value="Sign Up"
                />
              </div>
              <div className="text-center p-3 ">
                <Link className="text-decoration-none blue-text" to="/">
                  Already Have An Account ? Login Here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
