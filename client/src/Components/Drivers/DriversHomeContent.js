import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";

const DriversHomeContent = () => {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");

  const [bookingsData, setBookingsData] = useState([]);

  useEffect(() => {
    const fetchBookingsDetails = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/drivers/fetchBookingsDetails`,
          { decryptedUID }
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
  }, [decryptedUID]);

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
        <div className="bookings row">
          {bookingsData.map((booking) => (
            <div className="col-lg-12" key={booking.bid}>
              <div className="card my-3 mx-auto" style={{ height: "20rem" }}>
                <img
                  // src="/Images/2-Cars.png"
                  className="card-img-top img-fluid"
                  alt="Booking"
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {booking.trip_type === 1 ? "One Way Trip" : "Round Trip"}
                  </h5>
                  <p
                    style={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {" "}
                    Pickup: {booking.pickup_location}
                  </p>
                  <p
                    style={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {" "}
                    Drop: {booking.drop_location}
                  </p>

                  <p className="card-text text-secondary">
                    Date & Time :{" "}
                    {new Date(booking.pickup_date_time).toLocaleString(
                      "en-GB",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      }
                    )}
                  </p>
                  <div className="col-lg-6">
                    <Link to={`/booking-details?bid=${booking.bid}`}>
                      <button className="btn blue-buttons">View Details</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DriversHomeContent;
