import CssBaseline from "@mui/material/CssBaseline";
import type { NextPage } from "next";
import { IntroScreen } from "views";

const Home: NextPage = () => {
  return (
    <>
      <CssBaseline />
      <IntroScreen />
    </>
  );
};

export default Home;
