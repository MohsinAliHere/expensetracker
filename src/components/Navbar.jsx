import { Stack, Typography, IconButton } from "@mui/material";
import React from "react";
import { FaPowerOff } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { errormsg, successmsg } from "./toastify";
import { signOut } from "firebase/auth";
import { logOut } from "../redux/slices/auth";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = () => {
    signOut(auth)
      .then(() => {
        successmsg("Sign-out successful");
        dispatch(logOut());
        navigate("/register");
      })
      .catch((error) => {
        errormsg(error.message);
      });
  };

  return (
    <>
      <Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          padding={3}
        >
          <Stack>
            <Typography fontWeight="bolder" variant="h5">ExpenseTracker</Typography>
          </Stack>
          <Stack>
            <IconButton aria-label="LogOut" onClick={logout}>
              <FaPowerOff color="red" size={30} />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default Navbar;
