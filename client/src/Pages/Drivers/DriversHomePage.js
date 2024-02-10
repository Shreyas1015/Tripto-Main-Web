import React from "react";
import DriversSidebar from "../../Components/Drivers/DriversSidebar";
import DriversHomeContent from "../../Components/Drivers/DriversHomeContent";

const DriversHomePage = () => {
  return (
    <>
      <DriversSidebar contentComponent={<DriversHomeContent />} />
    </>
  );
};

export default DriversHomePage;
