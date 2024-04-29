import React from "react";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

const PaseengerTripSelectionButtonsContent = () => {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");

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

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6">
            <Link to={`/oneWayTrip?uid=${uid}`}>
              <button className="btn btn-lg btn-outline-dark">
                One Way Trip
              </button>
            </Link>
          </div>
          <div className="col-lg-6">
            <Link to={`/roundTrip?uid=${uid}`}>
              <button className="btn btn-lg btn-outline-dark">
                Round Trip
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaseengerTripSelectionButtonsContent;
