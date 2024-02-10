import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignUpPage";
import ForgetPass from "./Pages/ForgetPass";
import ResetPass from "./Pages/ResetPass";
import PassengerDashboard from "./Pages/Passengers/PassengerDashboard";
import PassengerHomePage from "./Pages/Passengers/PassengerHomePage";
import PassenegerProfile from "./Pages/Passengers/PassengerProfile";
import DriversDocumentVerification from "./Pages/Drivers/DriversDocumentVerification";
import DriversHomePage from "./Pages/Drivers/DriversHomePage";
import DriversDashboard from "./Pages/Drivers/DriversDashboard";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {
            // eslint-disable-next-line eqeqeq
            localStorage.getItem("user_type") == 1 ? (
              ""
            ) : // eslint-disable-next-line eqeqeq
            localStorage.getItem("user_type") == 2 ? (
              <>
                <Route
                  path="/passengerdashboard"
                  element={<PassengerDashboard />}
                />
                <Route
                  path="/passengerhomepage"
                  element={<PassengerHomePage />}
                />
                <Route
                  path="/passengerprofile"
                  element={<PassenegerProfile />}
                />
              </>
            ) : // eslint-disable-next-line eqeqeq
            localStorage.getItem("user_type") == 3 ? (
              <>
                <Route
                  path="/driversdocumentverification"
                  element={<DriversDocumentVerification />}
                />
                <Route path="/drivershomepage" element={<DriversHomePage />} />
                <Route
                  path="/driversdashboard"
                  element={<DriversDashboard />}
                />
              </>
            ) : // eslint-disable-next-line eqeqeq
            localStorage.getItem("user_type") == 4 ? (
              ""
            ) : (
              <>Please Login</>
            )
          }
          <Route path="/forgetPass" element={<ForgetPass />} />
          <Route path="/resetPass" element={<ResetPass />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
