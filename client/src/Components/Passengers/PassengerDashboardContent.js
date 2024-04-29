import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";

const PassengerDashboardContent = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");

  const BackToLogin = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchBookingsDataTable = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/passengers/fetchBookingsDataTable`,
          { decryptedUID }
        );

        setBookings(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Bookings Data Fetch Error: ", error.message);
      }
    };

    fetchBookingsDataTable();
  }, [decryptedUID]);

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
        <h2>Passenger Dashboard</h2>
        <hr />
        <div className="table-responsive container mt-2 p-3 rounded">
          <table className="table text-center  table-bordered rounded">
            <thead className="table-dark">
              <tr>
                <th scope="col">Sr No.</th>
                <th scope="col">Pick-Up Location</th>
                <th scope="col">Drop Location</th>
                <th scope="col">Pick-Up Date & Time</th>
                <th scope="col">Return Date & Time</th>
                <th scope="col">No. Of Days</th>
                <th scope="col">Trip Type</th>
                <th scope="col">Trip Status</th>
                <th scope="col">Distance</th>
                <th scope="col">Selected Car</th>
                <th scope="col">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{booking.pickup_location}</td>
                  <td>{booking.drop_location}</td>
                  <td>{booking.pickup_date_time}</td>
                  <td>{booking.drop_date_time}</td>
                  <td>{booking.no_of_days}</td>
                  <td>
                    {booking.trip_type === 1 ? "One Way Trip" : "Round Trip"}
                  </td>
                  <td>
                    {booking.trip_status === 0
                      ? "Pending"
                      : booking.trip_status === 1
                      ? "Accepted"
                      : "Completed"}
                  </td>
                  <td>{booking.distance} KM</td>
                  <td>
                    {booking.selected_car === 1
                      ? "( 4 + 1 SEDAN )"
                      : "( 6 + 1 SUV , MUV )"}
                  </td>
                  <td>{booking.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PassengerDashboardContent;
