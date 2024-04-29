import React from "react";
import PassengerSidebar from "../../Components/Passengers/PassengerSidebar";
import PassengerOneWayTripContent from "../../Components/Passengers/PassengerOneWayTripContent";

const PassengerOneWayTripPage = () => {
  return (
    <div>
      <PassengerSidebar contentComponent={<PassengerOneWayTripContent />} />
    </div>
  );
};

export default PassengerOneWayTripPage;
