import { useEffect } from "react";
import { useRouter } from "next/router";

import { useGoogleLogin } from "hooks";

import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import GoogleIcon from "@mui/icons-material/Google";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export const IntroScreen = () => {
  const { isLoggedIn, signIn } = useGoogleLogin();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const handleAuthClick = () => {
    signIn();
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card variant="outlined" sx={{ width: 420, padding: "1.5rem" }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Google Drive
          </Typography>
          <Typography variant="h5" component="div" sx={{ mb: 1 }}>
            File Uploader
          </Typography>
          <Typography variant="body2">
            Please connect your Google Account to access and upload your files.
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="large"
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon />}
            endIcon={<ArrowForwardIcon />}
            onClick={() => handleAuthClick()}
          >
            Connect to Google Drive
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};
