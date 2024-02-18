import {
  Stack,
  Typography,
  TextField,
  Grid,
  Box,
  Paper,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { BsCashCoin } from "react-icons/bs";
import { expenseField } from "../common/expense";
import "../style/AllStyle.css";
import { errormsg, successmsg } from "../components/toastify";
import { useNavigate } from "react-router-dom";
import { createData } from "../config/firebase/firebaseCRUD";
import { auth } from "../config/firebase";
const Expense = () => {
  const navigate = useNavigate();

  const [Attets, setAttets] = useState({
    Cash: 0,
    Saving: 0,
    Bank: 0,
    Total: 0,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setAttets({
      ...Attets,
      [id]: value,
    });
  };

  const addhandle = async () => {
    const { Bank, Cash, Saving } = Attets;

    if (Bank == 0 || Cash == 0 || Saving == 0) {
      return errormsg("Please enter all fields 🥲");
    } else {
      Attets.Total = +Bank + +Cash + +Saving;
      try {
        const userId = localStorage.getItem("userId");
        await createData(`/Expense/${userId}`, Attets);
        successmsg("Attests successfully created");
        navigate("/home");
      } catch (error) {
        errormsg(error.message);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        padding: "20px",
        "& > :not(style)": {
          m: 1,
          height: "auto",
          width: "100%",
        },
      }}
    >
      <Paper elevation={3}>

        <Stack padding={3} >
          <Typography variant="h4" >Assets</Typography>
        </Stack>


        <Grid
          sx={{
            padding: "10px",
          }}
          container
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
        >
          {expenseField.map((expenseField) => {
            return (
              <>
                <Grid xs={12} sm={12} md={4} lg={4}>
                  <Stack padding={2}>
                    <Stack
                      sx={{
                        backgroundColor: expenseField.bgColor,
                        height: "100px",
                        borderRadius: "10px",
                        padding: "20px",
                      }}
                    >
                      <Stack direction="row" spacing={2}>
                        <BsCashCoin color={expenseField.textColor} size={28} />
                        {expenseField.icon}
                        <Typography
                          color={expenseField.textColor}
                          fontWeight="bold"
                          variant="body1"
                        >
                          {expenseField.title}
                        </Typography>
                      </Stack>
                      <Stack my={3}>
                        <TextField
                          type="number"
                          id={expenseField.title}
                          onChange={(e) => handleChange(e)}
                          variant="standard"
                        />
                      </Stack>
                    </Stack>
                  </Stack>
                </Grid>
              </>
            );
          })}
        </Grid>

        <Stack direction="row" justifyContent="flex-end" padding={3}>
          <Button onClick={addhandle} variant="outlined">
            Add Assets
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Expense;
