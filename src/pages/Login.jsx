import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { errormsg, successmsg } from "../components/toastify";
import Loader from "../components/Loader";
import { auth, signInWithEmailAndPassword } from "../config/firebase";
import { useDispatch } from "react-redux";
import { authChecker } from "../redux/slices/auth";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [Loader, setLoader] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({
      ...form,
      [id]: value,
    });
  };

  const submit = async () => {
    setLoader(true);
    await signInWithEmailAndPassword(auth, form.email, form.password)
      .then((userCredential) => {
        const user = userCredential.user;
        setLoader(false);
        successmsg("User login successfully");
        localStorage.setItem("userId", user.uid);
        // dispatch(authChecker());
        navigate("/home");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoader(false);
        errormsg(errorMessage);
      });
  };


  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
          "& > :not(style)": {
            m: 1,
            width: 400,
            height: 400,
          },
        }}
      >
        <Paper elevation={5}>
          <Stack direction="column" spacing={2} my={3}>
            <Typography textAlign="center" variant="h5">
              ExpenseTracker
            </Typography>
            <Typography
              color="#3B8AD8"
              fontWeight="bold"
              textAlign="center"
              variant="h4"
            >
              Login
            </Typography>
          </Stack>

          <Stack direction="column" spacing={2} padding={3}>
            <TextField
              id="email"
              value={form.email}
              onChange={(e) => handleChange(e)}
              variant="outlined"
              placeholder="Email Address"
              type="email"
            />
            <TextField
              id="password"
              value={form.password}
              onChange={(e) => handleChange(e)}
              variant="outlined"
              placeholder="Password"
              type="password"
            />
            <Button onClick={submit} variant="outlined">
              {Loader ? "Loading ..." : "Login"}
            </Button>
            <Typography variant="body1">
              Don't have account <Link to="/register">Create account</Link>
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </>
  );
};

export default Login;
