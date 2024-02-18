import toast from "react-hot-toast";

const successmsg = (msg) => {
  return toast.success(msg);
};
const errormsg = (msg) => {
  return toast.error(msg);
};

export { successmsg, errormsg };
