import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";

const PassengerSidebar = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const uid = new URLSearchParams(location.search).get("uid");
  const [isOpen, setIsOpen] = useState(true);

  console.log("Passenger Id : ", uid);

  const BackToLogin = () => {
    navigate("/");
  };

  if (!uid) {
    return (
      <>
        <div className="container text-center fw-bold">
          <h2>INVALID URL. Please provide a valid UID.</h2>
          <button onClick={BackToLogin} className="btn blue-buttons">
            Back to Login
          </button>
        </div>
      </>
    );
  }

  const handleTrigger = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/logout`
      );

      if (response.status === 200) {
        window.localStorage.removeItem("user_type");
        navigate("/");
        alert("Logged Out Successfully");
      } else {
        console.error("Logout failed:", response.error);
      }
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <>
      <div className="page ">
        <div className="row container-fluid">
          <div className={`col-lg-${isOpen ? "2" : "0"} transition-col`}></div>
          <div className={`col-lg-${isOpen ? "10" : "12"} transition-col`}>
            <div className="content">{props.contentComponent}</div>
          </div>
        </div>

        <div className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
          <div
            style={{ color: "#0bbfe0" }}
            className="trigger"
            onClick={handleTrigger}
          >
            <i className={`fas ${isOpen ? "fa-times" : "fa-bars"}`}></i>
          </div>

          <Link
            className="text-decoration-none"
            to={`/passengerprofile?uid=${uid}`}
          >
            <div className="sidebar-position">
              <i style={{ color: "#0bbfe0" }} className="fa-solid fa-user "></i>
              <span> My Profile</span>
            </div>
          </Link>
          <Link
            className="text-decoration-none"
            to={`/passengerhomepage?uid=${uid}`}
          >
            <div className="sidebar-position">
              <i
                style={{ color: "#0bbfe0" }}
                className="fa-brands fa-windows"
              ></i>
              <span> Home</span>
            </div>
          </Link>
          <Link
            className="text-decoration-none"
            to={`/passengerdashboard?uid=${uid}`}
          >
            <div className="sidebar-position">
              <i
                style={{ color: "#0bbfe0" }}
                className="fa-brands fa-windows"
              ></i>
              <span> Dashboard</span>
            </div>
          </Link>

          <div className="sidebar-position" onClick={handleLogout}>
            <i
              style={{ color: "#0bbfe0" }}
              className="fa-solid fa-arrow-right-from-bracket"
            />
            <span> Logout</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PassengerSidebar;
