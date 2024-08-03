import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

const columns = [
  { id: "srNo", label: "Sr No.", minWidth: 80, align: "center" },
  {
    id: "pickup_location",
    label: "Pick-Up Location",
    minWidth: 170,
    align: "center",
  },
  {
    id: "drop_location",
    label: "Drop Location",
    minWidth: 170,
    align: "center",
  },
  {
    id: "pickup_date_time",
    label: "Pick-Up Date & Time",
    minWidth: 170,
    align: "center",
  },
  {
    id: "drop_date_time",
    label: "Return Date & Time",
    minWidth: 170,
    align: "center",
  },
  {
    id: "no_of_days",
    label: "No. Of Days",
    minWidth: 100,
    align: "center",
  },
  { id: "trip_type", label: "Trip Type", minWidth: 150, align: "center" },
  { id: "trip_status", label: "Trip Status", minWidth: 150, align: "center" },
  { id: "distance", label: "Distance", minWidth: 100, align: "center" },
  { id: "selected_car", label: "Selected Car", minWidth: 170, align: "center" },
  { id: "price", label: "Total Amount", minWidth: 100, align: "right" },
];

const formatDate = (dateString) => {
  if (!dateString) {
    return "-";
  }
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const PassengerDashboardContent = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (!uid) {
    return (
      <div className="container text-center fw-bold">
        <h2>INVALID URL. Please provide a valid UID.</h2>
        <button onClick={BackToLogin} className="btn blue-buttons">
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <h2>Passenger Dashboard</h2>
      <hr />
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          marginTop: "4rem",
          borderRadius: "2rem",
        }}
      >
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table
            stickyHeader
            aria-label="sticky table"
            className="custom-table"
          >
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((booking, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column) => {
                        let value;
                        switch (column.id) {
                          case "srNo":
                            value = index + 1;
                            break;
                          case "pickup_date_time":
                          case "drop_date_time":
                            value = formatDate(booking[column.id]);
                            break;
                          case "trip_type":
                            value =
                              booking[column.id] === 1
                                ? "One Way Trip"
                                : "Round Trip";
                            break;
                          case "trip_status":
                            value =
                              booking[column.id] === 0
                                ? "Pending"
                                : booking[column.id] === 1
                                ? "Accepted"
                                : "Completed";
                            break;
                          case "selected_car":
                            value =
                              booking[column.id] === 1
                                ? "4 Seater"
                                : "6 Seater";
                            break;
                          case "no_of_days":
                            value = booking[column.id] ?? 0;
                            break;
                          default:
                            value = booking[column.id];
                        }
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={bookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default PassengerDashboardContent;
