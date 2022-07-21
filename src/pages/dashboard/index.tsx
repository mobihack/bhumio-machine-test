import CssBaseline from "@mui/material/CssBaseline";
import type { NextPage } from "next";
import { DashboardScreen } from "views/DashboardScreen/DashboardScreen";

const Home: NextPage = () => {
  return (
    <>
      <CssBaseline />
      <DashboardScreen />
    </>
  );
};

export default Home;
