import axiosInstance from "../../API/axiosInstance";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

const PassengerOneWayTripContent = () => {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [fourSeater, setFourSeater] = useState(0);
  const [sixSeater, setSixSeater] = useState(0);

  const [pid, setPid] = useState(0);
  const [oneWayTrip, setOneWayTrip] = useState({
    uid: decryptedUID,
    pid: "",
    pickup_location: "",
    drop_location: "",
    pickup_date_time: "",
  });

  const [selectedCar, setSelectedCar] = useState("");
  const [showCarSelection, setShowCarSelection] = useState(false);

  useEffect(() => {
    const fetchPID = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/passengers/fetchPID`,
          { decryptedUID }
        );

        setPid(parseInt(res.data, 10));
        console.log("PID : ", res.data);
      } catch (error) {
        console.error("Fetch PID Error: ", error.message);
      }
    };

    fetchPID();
  }, [decryptedUID]);

  const handlePhaseOne = (e) => {
    e.preventDefault();
    calculatingPrice();
    setShowCarSelection(true); // Show car selection after phase one
  };

  const calculatingPrice = () => {
    const distance = 50;
    const priceForFourSeater = distance * 12;
    const priceForSixSeater = distance * 16;
    setFourSeater(priceForFourSeater);
    setSixSeater(priceForSixSeater);
  };

  const handlePhaseTwo = async (e) => {
    e.preventDefault();

    try {
      const distance = 50; // Dummy distance in kilometers
      let price = 0;

      // Calculate price based on selected car type
      if (selectedCar === "4-seater") {
        price = fourSeater;
      } else if (selectedCar === "6-seater") {
        price = sixSeater;
      }

      const selectedCarValue = selectedCar === "4-seater" ? 1 : 2;

      const formData = {
        uid: decryptedUID,
        pid: pid,
        pickup_location: oneWayTrip.pickup_location,
        drop_location: oneWayTrip.drop_location,
        pickup_date_time: oneWayTrip.pickup_date_time,
        distance: distance,
        selected_car: selectedCarValue,
        price: price,
      };

      // Send data to backend
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/passengers/handleOneWayTrip`,
        { formData, decryptedUID }
      );

      if (res.status === 200) {
        alert(`Your trip has been booked successfully!`);
        setOneWayTrip({
          pickup_location: "",
          drop_location: "",
          pickup_date_time: "",
        });
        setSelectedCar("");
        setShowCarSelection(false);
      } else {
        console.error("Error in Booking Trip!");
        alert("Error in Booking Trip!");
      }
    } catch (error) {
      console.error("Error in Booking Trip: ", error.message);
      alert("Error in Booking Trip!");
    }
  };

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
        <h2>One Way Trip</h2>
        <hr />
        <div className="row">
          <div className="col-lg-6">
            <div className="one-way-trip">
              <div
                className="card mx-auto my-5"
                style={{ width: "25rem", height: "21rem" }}
              >
                <div className="card-body">
                  <h5 className="card-title">
                    Select Pickup and Drop Location
                  </h5>
                  <hr />
                  <form onSubmit={handlePhaseOne}>
                    <div className="input-group mb-4">
                      <span className="input-group-text">Pickup Location</span>
                      <input
                        name="pickup_location"
                        type="url"
                        className="form-control"
                        required
                        value={oneWayTrip.pickup_location}
                        onChange={(e) =>
                          setOneWayTrip({
                            ...oneWayTrip,
                            pickup_location: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="input-group mb-4">
                      <span className="input-group-text">Drop Location</span>
                      <input
                        name="drop_location"
                        type="url"
                        className="form-control"
                        required
                        value={oneWayTrip.drop_location}
                        onChange={(e) =>
                          setOneWayTrip({
                            ...oneWayTrip,
                            drop_location: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="input-group mb-4">
                      <span className="input-group-text">Date and Time</span>
                      <input
                        type="datetime-local"
                        className="form-control"
                        required
                        value={oneWayTrip.pickup_date_time}
                        onChange={(e) =>
                          setOneWayTrip({
                            ...oneWayTrip,
                            pickup_date_time: e.target.value,
                          })
                        }
                      />
                    </div>
                    <input
                      type="submit"
                      value="Phase 1: Submit Locations and Time"
                      className="blue-buttons form-control"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            {showCarSelection && (
              <div className="car-selection">
                <div className="card mx-auto my-5" style={{ width: "25rem" }}>
                  <div className="card-body">
                    <h5 className="card-title">Select Car Type</h5>
                    <hr />
                    <div className="mb-4">
                      <label htmlFor="4-seater" className="form-label">
                        4-seater
                      </label>
                      <input
                        type="radio"
                        id="4-seater"
                        name="car-type"
                        value="4-seater"
                        onChange={(e) => setSelectedCar(e.target.value)}
                        checked={selectedCar === "4-seater"}
                      />

                      <span>{fourSeater}</span>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="6-seater" className="form-label">
                        6-seater
                      </label>
                      <input
                        type="radio"
                        id="6-seater"
                        name="car-type"
                        value="6-seater"
                        onChange={(e) => setSelectedCar(e.target.value)}
                        checked={selectedCar === "6-seater"}
                      />
                      <span>{sixSeater}</span>
                    </div>
                    <input
                      type="submit"
                      value="Phase 2: Book Trip"
                      className="blue-buttons form-control"
                      onClick={handlePhaseTwo}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PassengerOneWayTripContent;
