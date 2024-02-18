import { IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import { BsCashCoin } from "react-icons/bs";
import { MdDelete, MdOutlineSavings } from "react-icons/md";
import { CiBank } from "react-icons/ci";
import { errormsg, successmsg } from "./toastify";
import { deleteData, updateData } from "../config/firebase/firebaseCRUD";

const TransactionList = (props) => {
  const { amount, from, notes, getTransactionList, Attest } = props;
  let color;
  let icon;
  if (from == "Saving") {
    color = "#FFF4E5";
    icon = <MdOutlineSavings size={28} />;
  }
  if (from == "Bank") {
    color = "#EDF7ED";
    icon = <CiBank size={28} />;
  }
  if (from == "Cash") {
    color = "#F3FBFE";
    icon = <BsCashCoin size={28} />;
  }

  const deletetransaction = async (id) => {
    try {
      const userId = localStorage.getItem("userId");
      await deleteData(`Transaction/${userId}/${id}`);

      if (from === "Saving") {
        Attest.Saving += parseFloat(amount);
      }
      if (from === "Cash") {
        Attest.Cash += parseFloat(amount);
      }
      if (from === "Bank") {
        Attest.Bank += parseFloat(amount);
      }
      Attest.Total = +Attest.Cash + +Attest.Saving + +Attest.Bank;
      await updateData(`/Expense/${userId}`, Attest);
      getTransactionList();
    } catch (error) {
      console.log(error);
      errormsg(error.message);
    }
  };

  return (
    <Stack padding={1}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          backgroundColor: color,
          padding: "8px",
          borderRadius: "8px",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Stack>{icon}</Stack>
          <Stack>
            <Typography variant="h5">{amount}</Typography>
            <Typography variant="h6">{from}</Typography>
          </Stack>
          <Stack>
            <Typography variant="h5">{notes}</Typography>
          </Stack>
        </Stack>
        <Stack>
          <IconButton
            aria-label=""
            onClick={() => deletetransaction(props.uniqueId)}
          >
            <MdDelete size={30} />
          </IconButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TransactionList;
