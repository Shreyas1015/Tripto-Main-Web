import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";

const DriversHomeContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const uid = new URLSearchParams(location.search).get("uid");

  const [bookingsData, setBookingsData] = useState([]);

  useEffect(() => {
    const fetchBookingsDetails = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/drivers/fetchBookingsDetails`,
          { uid }
        );
        if (res.status === 200) {
          setBookingsData(res.data);
          console.log(res.data);
        } else {
          alert("Error Fetching Bookings Details!");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchBookingsDetails();
  }, [uid]);

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
        <h2>Drivers Home Page</h2>
        <hr />
        <div className="bookings">
          {bookingsData.map((booking) => (
            <div key={booking.bid} className="card" style={{ width: "18rem" }}>
              <img src="" className="card-img-top" alt="Booking" />
              <div className="card-body">
                <h5 className="card-title">{booking.trip_type}</h5>
                <p className="card-text">
                  Pickup: {booking.pickup_location}
                  <br />
                  Drop: {booking.drop_location}
                  <br />
                  Date & Time: {booking.pickup_date_time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DriversHomeContent;
