import React from "react";
import PassengerSidebar from "../../Components/Passengers/PassengerSidebar";
import PassengerRoundTripContent from "../../Components/Passengers/PassengerRoundTripContent";

const RoundTripPage = () => {
  return (
    <div>
      <PassengerSidebar contentComponent={<PassengerRoundTripContent />} />
    </div>
  );
};

export default RoundTripPage;
