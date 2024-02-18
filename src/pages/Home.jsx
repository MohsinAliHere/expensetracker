import {
  Stack,
  Typography,
  TextField,
  Grid,
  Box,
  Paper,
  IconButton,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";

import React, { useEffect, useState } from "react";
import { BsCashCoin } from "react-icons/bs";
import { expenseField } from "../common/expense";
import "../style/AllStyle.css";
import { MdAdd, MdDelete, MdEdit, MdOutlineSavings } from "react-icons/md";
import { RiCheckFill } from "react-icons/ri";
import { errormsg, successmsg } from "../components/toastify";
import {
  createData,
  readData,
  updateData,
} from "../config/firebase/firebaseCRUD";
import LoaderComp from "../components/Loader";
import { RxCross1 } from "react-icons/rx";
import { IoRefreshCircleOutline } from "react-icons/io5";
import TransactionList from "../components/TransactionList";
import Navbar from "../components/Navbar";
import Graphs from "../components/Graphs";

const Home = () => {
  const [Loader, setLoader] = useState(false);
  const [editableField, setEditableField] = useState(null);
  const [Attest, setAttest] = useState({ Cash: 0, Saving: 0, Bank: 0 });
  const [TransactionData, setTransactionData] = useState(null);
  const [Transaction, setTransaction] = useState({
    amount: "",
    from: "",
    notes: "",
  });
  // modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [age, setAge] = React.useState("");

  const handleChangeSelect = (event) => {
    setTransaction({
      ...Transaction,
      from: event.target.value,
    });
  };

  const getAttetsData = async () => {
    try {
      setLoader(true);
      const userId = localStorage.getItem("userId");
      const data = await readData(`/Expense/${userId}`);
      setAttest(data || { Cash: 0, Saving: 0, Bank: 0 });
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error("Error while fetching data:", error);
      errormsg(error.message);
    }
  };

  const getTransactionList = async () => {
    try {
      setLoader(true);
      const userId = localStorage.getItem("userId");
      const data = await readData(`/Transaction/${userId}`);
      let list = data == null ? [] : Object.values(data);
      setTransactionData(list);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error("Error while fetching data:", error);
      errormsg(error.message);
    }
  };

  useEffect(() => {
    getTransactionList();
    getAttetsData();
  }, []);

  const makeTransaction = async () => {
    if (!Transaction.amount || !Transaction.from || !Transaction.notes) {
      return errormsg("All fields are required 🥲");
    }

    if (Transaction.from === "Saving") {
      Attest.Saving -= parseFloat(Transaction.amount);
    }
    if (Transaction.from === "Cash") {
      Attest.Cash -= parseFloat(Transaction.amount);
    }
    if (Transaction.from === "Bank") {
      Attest.Bank -= parseFloat(Transaction.amount);
    }
    const userId = localStorage.getItem("userId");
    Attest.Total = +Attest.Cash + +Attest.Saving + +Attest.Bank;
    await updateData(`/Expense/${userId}`, Attest);
    const uniqueId = uuidv4();
    await createData(`/Transaction/${userId}/${uniqueId}`, {
      ...Transaction,
      uniqueId,
    });
    getTransactionList();
    setTransaction({
      from: "",
      amount: "",
      notes: "",
    });
    handleClose();
    successmsg("Successfully updated");
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setAttest({
      ...Attest,
      [id]: value,
    });
  };

  const getUpdateData = async () => {
    try {
      setEditableField(null);
      const userId = localStorage.getItem("userId");
      Attest.Total = +Attest.Cash + +Attest.Saving + +Attest.Bank;
      await updateData(`/Expense/${userId}`, Attest);
      successmsg("Successfully updated");
    } catch (error) {
      errormsg(error.message);
    }
  };

  if (Loader) {
    return <LoaderComp />;
  }

  return (
    <>
      <Navbar />
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
          <Grid
            sx={{
              padding: "10px",
            }}
            container
            justifyContent="space-between"
            alignItems="center"
            spacing={0}
          >
            {expenseField.map((expenseField, index) => (
              <Grid item key={index} xs={12} sm={12} md={6} lg={3}>
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
                      <Typography
                        color={expenseField.textColor}
                        fontWeight="bold"
                        variant="body1"
                      >
                        {expenseField.title}
                      </Typography>
                    </Stack>
                    <Stack my={3}>
                      {editableField === expenseField?.title ? (
                        <Stack direction="row" spacing={2}>
                          <TextField
                            type="number"
                            defaultValue={
                              !Loader && Attest[expenseField?.title]
                            }
                            id={expenseField?.title}
                            onChange={(e) => handleChange(e)}
                            sx={{ flex: 1 }}
                            variant="standard"
                          />
                          
                          <IconButton
                            aria-label=""
                            onClick={() => getUpdateData()}
                          >
                            <RiCheckFill size={25} color="black" />
                          </IconButton>
                        </Stack>
                      ) : (
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Stack>
                            <Typography variant="h4">
                              {!Loader && Attest[expenseField?.title]}
                            </Typography>
                          </Stack>
                          <Stack>
                            <IconButton
                              aria-label=""
                              onClick={() =>
                                setEditableField(expenseField.title)
                              }
                            >
                              <MdEdit color="black" size={30} />
                            </IconButton>
                          </Stack>
                        </Stack>
                      )}
                    </Stack>
                  </Stack>
                </Stack>
              </Grid>
            ))}

            {/* total Attets */}
            <Grid xs={12} sm={12} md={6} lg={3}>
              <Stack padding={2}>
                <Stack
                  sx={{
                    backgroundColor: "#D8FBF6",
                    height: "100px",
                    borderRadius: "10px",
                    padding: "20px",
                  }}
                >
                  <Stack direction="row" spacing={2}>
                    <BsCashCoin color="#2A9D90" size={28} />
                    <Typography fontWeight="bold" variant="body1">
                      Total
                    </Typography>
                  </Stack>
                  <Stack my={3}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Stack>
                        <Typography variant="h4">
                          {!Loader && Attest?.Total}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Box>

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
        <Grid container justifyContent="space-between" alignItems="center">
          {/* Graph Section */}

          <Grid

            item xs={12} sm={12} md={6} lg={6}>
            <Paper sx={{ height: "450px", marginY: "10px", padding: "10px" }} elevation={3}>
              <Stack padding={2}>
                <Typography fontWeight="bolder" variant="h6">
                  Overview
                </Typography>
              </Stack>

              <Graphs Attest={Attest} />
            </Paper>
          </Grid>

          {/* transactions section */}
          <Grid
            item xs={12} sm={12} md={5} lg={5}>
            <Paper
              sx={{ height: "450px", marginY: "10px", padding: "10px" }}
              elevation={3}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                padding={2}
              >
                <Stack>
                  <Typography fontWeight="bolder" variant="h6">
                    Transaction
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <IconButton aria-label="">
                    <IoRefreshCircleOutline
                      onClick={() => getTransactionList()}
                      color="black"
                      size={28}
                    />
                  </IconButton>
                  <IconButton aria-label="" onClick={handleOpen}>
                    <MdAdd color="black" size={28} />
                  </IconButton>
                </Stack>
              </Stack>

              <Stack
                sx={{
                  overflowY: "scroll",
                  maxHeight: "360px",
                  padding: "10px",
                }}
              >
                {TransactionData?.length == 0 ? (
                  <Typography textAlign="center" variant="body2" >No Transaction Yet 😊 </Typography>
                ) : (
                  TransactionData?.map((e) => {
                    return (
                      <TransactionList
                        {...e}
                        getTransactionList={getTransactionList}
                        Attest={Attest}
                      />
                    );
                  })
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack direction="column" spacing={3}>
            <Stack>
              <Typography variant="h4">Transaction</Typography>
            </Stack>
            <TextField
              id="Amount"
              placeholder="Amount"
              value={Transaction.amount}
              onChange={(e) =>
                setTransaction({
                  ...Transaction,
                  amount: e.target.value,
                })
              }
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">From</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={Transaction.from}
                label="Age"
                onChange={(e) =>
                  setTransaction({
                    ...Transaction,
                    from: e.target.value,
                  })
                }
              >
                <MenuItem selected value="Cash">
                  Cash
                </MenuItem>
                <MenuItem value="Bank">Bank</MenuItem>
                <MenuItem value="Saving">Saving</MenuItem>
              </Select>
            </FormControl>
            <TextField
              placeholder="Notes"
              id="notes"
              type="text"
              value={Transaction.notes}
              onChange={(e) =>
                setTransaction({
                  ...Transaction,
                  [e.target.id]: e.target.value,
                })
              }
            />
            <Button onClick={makeTransaction} variant="text">
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default Home;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
