import { useState } from "react";
import { useRouter } from "next/router";

import {
  CircularProgress,
  Button,
  Card,
  CardContent,
  CardActions,
  Container,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";

import { UploaderModal } from "./containers/UploaderModal/UploaderModal";
import { useGoogleLogin } from "hooks/useGoogleLogin";
import { useFetch } from "hooks/useFetch";
import { fileSaver } from "utils/fileSaver";
import {getFilesAPI, downloadFileAPI} from "api";

import { DashboardHeader, FileListTable } from "./components";

export const DashboardScreen = () => {
  const router = useRouter();
  const { signOut, user, isLoggedIn } = useGoogleLogin();

  const [isUploaderModalOpen, setIsUploaderModalOpen] = useState(false);

  const {
    data: files,
    isLoading,
    mutate: reloadFiles,
  } = useFetch(isLoggedIn ? "/api/list" : null, getFilesAPI);

  if (!isLoggedIn || !user) return <></>;

  const startSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const downloadFile = async (i: number) => {
    if (!files || !Boolean(files[i])) return;

    try {
      const res = await downloadFileAPI(files[i]._id);

      if (res) {
        var array = new Uint8Array(res.file.data.data);
        var blob = new Blob([array]);
        fileSaver({
          fileData: blob,
          name: res.name,
        });
      } else {
        throw "error";
      }
    } catch (err) {
      console.log(err);

      alert("An error occured while downloading file.");
    }
  };

  const onUploaderModalClosed = () => {
    setIsUploaderModalOpen(false);
    reloadFiles();
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
      <Card variant="outlined" sx={{ minWidth: 640, padding: "1.5rem" }}>
        <CardContent>
          <DashboardHeader
            email={user.cu}
            name={user.Ad}
            description="You have successfully connected your Google Account."
          />
          {isLoading && (
            <div style={{ display: "flex" }}>
              <CircularProgress sx={{ marginX: "auto" }} />
            </div>
          )}
          {files && (
            <FileListTable
              files={files}
              onFileDownload={(i) => downloadFile(i)}
            />
          )}
          {files?.length === 0 && <div style={{
            padding: "2rem",
            textAlign: 'center'
          }}>No Files Found</div>}
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            color="error"
            startIcon={<LogoutIcon />}
            onClick={startSignOut}
          >
            Sign out
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsUploaderModalOpen(true)}
          >
            Add Files
          </Button>
        </CardActions>
      </Card>
      <UploaderModal
        isOpen={isUploaderModalOpen}
        onClose={onUploaderModalClosed}
      />
    </Container>
  );
};
