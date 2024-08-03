import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../API/axiosInstance";

const Header = () => {
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [profileData, setProfileData] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/passengers/fetchProfileData`,
          { decryptedUID }
        );

        if (response.status === 200) {
          setProfileData(response.data);
        }
      } catch (error) {
        console.error("Error fetching Profile Data:", error.message);
      }
    };

    fetchProfileData();
  }, [decryptedUID]);

  return (
    <>
      <h5>Hello {profileData.name} !!</h5>
      <h1>Welcome Back</h1>
      <hr />
    </>
  );
};

export default Header;
