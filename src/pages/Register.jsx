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
import { auth, createUserWithEmailAndPassword } from "../config/firebase";
import { createData } from "../config/firebase/firebaseCRUD";
import { useDispatch } from "react-redux";
import { authChecker } from "../redux/slices/auth";

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [form, setForm] = useState({
    username: "",
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

  const submit = () => {
    setLoader(true);
    createUserWithEmailAndPassword(auth, form.email, form.password)
      .then((userCredential) => {
        successmsg("Registration successfully");
        const user = userCredential.user;
        createData(`/userData/${user.uid}`, form);
        localStorage.setItem('userId', user.uid);
        setLoader(false);
        dispatch(authChecker())
        navigate("/expense")
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
            height: 475,
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
              Register
            </Typography>
          </Stack>

          <Stack direction="column" spacing={2} padding={3}>
            <TextField
              id="username"
              value={form.username}
              onChange={(e) => handleChange(e)}
              variant="outlined"
              placeholder="Username"
              type="text"
            />
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
              {Loader ? "Loading ..." : "Register"}
            </Button>
            <Typography variant="body1">
              Already have account <Link to="/">Create account</Link>
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </>
  );
};

export default Register;
