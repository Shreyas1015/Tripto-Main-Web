import React from "react";
import DriversSidebar from "../../Components/Drivers/DriversSidebar";
import BookingDetailsContent from "../../Components/Drivers/BookingDetailsContent";

const BookingDetailsPage = () => {
  return (
    <>
      <DriversSidebar contentComponent={<BookingDetailsContent />} />
    </>
  );
};

export default BookingDetailsPage;
