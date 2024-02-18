import { Stack } from "@mui/material";
import LoaderImg from "../assets/loading-infinity.gif";
const Loader = () => {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ height: "100vh" }}
    >
      <img   
      
      style={{
        mixBlendMode:"darken"
      }}
      src={LoaderImg} alt="" />
    </Stack>
  );
};

export default Loader;
