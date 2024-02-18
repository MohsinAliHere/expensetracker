import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Expense from "../pages/Expense";
import Home from "../pages/Home";
import { authChecker } from "../redux/slices/auth";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "./firebase";
import LoaderComp from "../components/Loader";

const AppRouter = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const { isLogin } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = () => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          // if user is login then dispatch authChecker = true
          dispatch(authChecker());
        }
        setIsLoading(false);
      });
    };

    checkAuth();
  }, []);


  if (isLoading) {
    return <LoaderComp />
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {isLogin ? (
          <>
            <Route path="/expense" element={<Expense />} />
            <Route path="/home" element={<Home />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
};

export default AppRouter;
