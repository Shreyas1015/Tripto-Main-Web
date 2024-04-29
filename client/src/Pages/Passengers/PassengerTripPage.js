import React from "react";
import PassengerSidebar from "../../Components/Passengers/PassengerSidebar";
import PaseengerTripSelectionButtonsContent from "../../Components/Passengers/PaseengerTripSelectionButtonsContent";

const PassengerTripPage = () => {
  return (
    <>
      <PassengerSidebar
        contentComponent={<PaseengerTripSelectionButtonsContent />}
      />
    </>
  );
};

export default PassengerTripPage;
