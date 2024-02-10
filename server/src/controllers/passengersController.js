require("dotenv").config();
const nodemailer = require("nodemailer");
const asyncHand = require("express-async-handler");
const connection = require("../config/dbConfig");
const ImageKit = require("imagekit");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  logger: true,
  debug: true,
  secureConnection: false,
  auth: {
    user: 'triptotours.com@gmail.com',
    pass: 'vdgg zkjt ugxk xwso',
  },
  tls: {
    rejectUnauthorized: true
  }
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: "triptotours.com@gmail.com",
    to: email,
    subject: "Email Verification OTP",
    text: `Your OTP for email verification is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
  console.log(
    "Email verification OTP sent to mail:",
    email,
    "and the OTP is:",
    otp
  );
}

async function sendOTPPhone(phone, otp) {
  // Implement code to send the OTP via SMS (not provided here)
  console.log(
    "Phone verification OTP sent to phone:",
    phone,
    "and the OTP is:",
    otp
  );
}

const imagekit = new ImageKit({
  publicKey: "public_ytabO1+xt+yMhICKtVeVGbWi/u8=",
  privateKey: "private_b65RyEF/ud3utxYKAJ8mvx7BWSw=",
  urlEndpoint: "https://ik.imagekit.io/TriptoServices",
});

const passenger_document_auth = asyncHand((req, res) => {
  try {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    console.log("Authentication Parameters:", authenticationParameters);
    res.json(authenticationParameters);
  } catch (error) {
    console.error("Error generating authentication parameters:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const fetchProfileData = asyncHand((req, res) => {
  const { uid } = req.body;
  if (!req.user || !req.user.email) {
    res
      .status(401)
      .json({ message: "Unauthorized - Missing or invalid token" });
  } else {
    const UserID = parseInt(uid);
    const authenticatedUserID = req.uid;
    console.log("authenticatedUserID : ", authenticatedUserID);
    console.log("USer ID : ", UserID);
    if (authenticatedUserID !== UserID) {
      return res.status(403).json({ message: "Forbidden - Access denied" });
    }
  }

  const searchQuery = "Select * from users where uid = ?";
  connection.query(searchQuery, uid, (err, result) => {
    if (err) {
      console.error(`Error executing query ${err}`);
      res.status(500).json({ error: "Server Error" });
    } else {
      if (result.length === 0) {
        res.status(404).json({ message: "No such user found." });
      } else {
        let data = result[0];
        console.log("Profle Data Fetched");
        res.status(200).json(data);
      }
    }
  });
});

const updateProfile = asyncHand((req, res) => {
  const formData = req.body;
  console.log("FormData.uid :", formData.uid);

  if (!req.user || !req.user.email) {
    res
      .status(401)
      .json({ message: "Unauthorized - Missing or invalid token" });
    return;
  }

  const userID = parseInt(formData.uid);
  const authenticatedUserID = req.uid;

  console.log("authenticatedUserID : ", authenticatedUserID);
  console.log("User ID : ", userID);

  if (authenticatedUserID !== userID) {
    return res.status(403).json({ message: "Forbidden - Access denied" });
  }

  const updateQuery =
    "UPDATE users SET name = ?, email = ?, phone_number = ? WHERE uid = ?";
  const updateValues = [
    formData.name,
    formData.email,
    formData.phone_number,
    formData.uid,
  ];

  connection.query(updateQuery, updateValues, (err, result) => {
    if (err) {
      console.error(`Error updating profile: ${err}`);
      return res.status(500).json({ error: "Server Error" });
    }

    if (formData.user_type == 2) {
      const updatePassengerQuery =
        "UPDATE passengers SET name = ?, email = ?, phone_number = ? WHERE uid = ?";
      const updatePassengerValues = [
        formData.name,
        formData.email,
        formData.phone_number,
        formData.uid,
      ];

      connection.query(updatePassengerQuery, updatePassengerValues, (err) => {
        if (err) {
          console.error(`Error updating passenger profile: ${err}`);
          return res.status(500).json({ error: "Server Error" });
        }

        console.log("Profile updated: ", result);
        return res
          .status(200)
          .json({ message: "Profile Updated Successfully" });
      });
    } else {
      console.log("Profile updated: ", result);
      return res.status(200).json({ message: "Profile Updated Successfully" });
    }
  });
});

const sendProfileUpdateEmailVerification = asyncHand(async (req, res) => {
  const { uid } = req.body;
  const otp = generateOTP();

  try {
    const selectQuery = "SELECT email FROM users WHERE uid = ?";
    connection.query(selectQuery, [uid], (selectErr, selectResult) => {
      if (selectErr) {
        console.error("Error fetching user email:", selectErr);
        return res.status(500).json({ success: false, email: null });
      }

      const email = selectResult[0].email;

      connection.query(
        "INSERT INTO email_verification_otps (email, otp, created_at) VALUES (?, ?, NOW())",
        [email, otp],
        (insertErr) => {
          if (insertErr) {
            console.error("Error saving email OTP to the database:", insertErr);
            return res.status(500).json({ success: false, email: null });
          }

          sendOTPEmail(email, otp);
          res.status(200).json({ success: true, email });
        }
      );
    });
  } catch (error) {
    console.error("Error sending email verification code:", error);
    res.status(500).json({ success: false, email: null });
  }
});

const fetchProfileIMG = asyncHand((req, res) => {
  const { uid } = req.body;
  if (!req.user || !req.user.email) {
    res
      .status(401)
      .json({ message: "Unauthorized - Missing or invalid token" });
  } else {
    const UserID = parseInt(uid);
    const authenticatedUserID = req.uid;
    console.log("authenticatedUserID : ", authenticatedUserID);
    console.log("USer ID : ", UserID);
    if (authenticatedUserID !== UserID) {
      return res.status(403).json({ message: "Forbidden - Access denied" });
    }
  }

  const query = "select profile_img from passengers where uid = ? ";
  connection.query(query, [uid], (err, result) => {
    if (err) {
      console.error(`Failed to execute ${query}`, err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      console.log("Image link fetched", result[0]);
      res.status(200).json({ link: result[0] });
    }
  });
});

const uploadProfileImage = asyncHand(async (req, res) => {
  const formData = req.body;

  if (!req.user || !req.user.email) {
    res
      .status(401)
      .json({ message: "Unauthorized - Missing or invalid token" });
  } else {
    const UserID = parseInt(formData.uid);
    const authenticatedUserID = req.uid;
    console.log("authenticatedUserID: ", authenticatedUserID);
    console.log("User ID: ", UserID);

    if (authenticatedUserID !== UserID) {
      return res.status(403).json({ message: "Forbidden - Access denied" });
    }

    const checkUidQuery =
      "SELECT COUNT(*) AS count FROM passengers WHERE uid = ?";
    connection.query(checkUidQuery, [UserID], (checkUidErr, checkUidResult) => {
      if (checkUidErr) {
        console.error("Internal Server error: ", checkUidErr);
        return res.status(500).json({ error: "Internal Server error" });
      }

      const uidExists = checkUidResult[0].count > 0;

      if (uidExists) {
        const updateQuery =
          "UPDATE passengers SET profile_img = ? WHERE uid = ?";
        connection.query(
          updateQuery,
          [formData.profile_img, UserID],
          (updateErr, updateResult) => {
            if (updateErr) {
              console.error("Internal Server error: ", updateErr);
              return res.status(500).json({ error: "Internal Server error" });
            }

            console.log("Profile Img Updated");
            res.status(200).json({ message: "Profile Img Updated" });
          }
        );
      } else {
        const insertQuery =
          "INSERT INTO passengers (uid, profile_img) VALUES (?, ?)";
        connection.query(
          insertQuery,
          [UserID, formData.profile_img],
          (insertErr, insertResult) => {
            if (insertErr) {
              console.error("Internal Server error: ", insertErr);
              return res.status(500).json({ error: "Internal Server error" });
            }

            console.log("Profile Img Inserted");
            res.status(200).json({ message: "Profile Img Inserted" });
          }
        );
      }
    });
  }
});

const handleOneWayTrip = asyncHand((req, res) => {
  const formData = req.body;
  console.log("FormData.uid :", formData.uid);

  if (!req.user || !req.user.email) {
    res
      .status(401)
      .json({ message: "Unauthorized - Missing or invalid token" });
    return;
  }

  const userID = parseInt(formData.uid);
  const authenticatedUserID = req.uid;

  console.log("authenticatedUserID : ", authenticatedUserID);
  console.log("User ID : ", userID);

  if (authenticatedUserID !== userID) {
    return res.status(403).json({ message: "Forbidden - Access denied" });
  }

  const values = [
    userID,
    formData.pid,
    formData.pickup_location,
    formData.drop_location,
    formData.pickup_date_time,
  ];
  const query =
    "INSERT INTO bookings (uid,pid,pickup_location,drop_location,pickup_date_time,trip_type) VALUES (?,?,?,?,?,1) ";
  connection.query(query, values, (err, result) => {
    if (err) {
      console.error(
        `Error executing MySQL Query for adding one way trip: ${err}`
      );

      return res.status(500).json({ error: "Server Error" });
    } else {
      console.log("Trip booked Successfully");
      res.status(200).json({ message: "Trip Booked Successfully" });
    }
  });
});

const handleRoundTrip = asyncHand((req, res) => {
  const formData = req.body;
  console.log("FormData.uid :", formData.uid);

  if (!req.user || !req.user.email) {
    res
      .status(401)
      .json({ message: "Unauthorized - Missing or invalid token" });
    return;
  }

  const userID = parseInt(formData.uid);
  const authenticatedUserID = req.uid;

  console.log("authenticatedUserID : ", authenticatedUserID);
  console.log("User ID : ", userID);

  if (authenticatedUserID !== userID) {
    return res.status(403).json({ message: "Forbidden - Access denied" });
  }

  const values = [
    userID,
    formData.pid,
    formData.pickup_location,
    formData.drop_location,
    formData.pickup_date_time,
    formData.drop_date_time,
  ];

  const query =
    "INSERT INTO bookings (uid,pid,pickup_location,drop_location,pickup_date_time,drop_date_time,trip_type) VALUES (?,?,?,?,?,?,2)";
  connection.query(query, values, (err, result) => {
    if (err) {
      console.error(
        `Error executing MySQL Query for adding one way trip: ${err}`
      );
      return res.status(500).json({ error: "Server Error" });
    } else {
      console.log("Trip booked Successfully");
      res.status(200).json({ message: "Trip Booked Successfully" });
    }
  });
});

const fetchPID = asyncHand((req, res) => {
  const { uid } = req.body;
  if (!req.user || !req.user.email) {
    res
      .status(401)
      .json({ message: "Unauthorized - Missing or invalid token" });
  } else {
    const UserID = parseInt(uid);
    const authenticatedUserID = req.uid;
    console.log("authenticatedUserID : ", authenticatedUserID);
    console.log("USer ID : ", UserID);
    if (authenticatedUserID !== UserID) {
      return res.status(403).json({ message: "Forbidden - Access denied" });
    }

    const query = "Select pid from passengers where uid = ?";
    connection.query(query, uid, (err, result) => {
      if (err) {
        console.error("Internal Server Error", err);

        res.status(500).json({ error: "Internal Server Error" });
      } else {
        console.log("PID : ", result[0].pid);
        res.status(200).json(result[0].pid);
      }
    });
  }
});

module.exports = {
  passenger_document_auth,
  fetchProfileData,
  updateProfile,
  sendProfileUpdateEmailVerification,
  fetchProfileIMG,
  uploadProfileImage,
  handleOneWayTrip,
  handleRoundTrip,
  fetchPID,
};
