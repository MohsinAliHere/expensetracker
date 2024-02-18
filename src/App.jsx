import React, { useState } from "react";
import AppRouter from "./config/AppRouter";
import "./App.css";
import { Navigate, useNavigate } from "react-router-dom";
import Loader from "./components/Loader";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
const App = () => {
  

  return <AppRouter />;
};

export default App;
