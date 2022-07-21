import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
  Backdrop,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { useGoogleLogin } from "hooks/useGoogleLogin";
import { useEffect, useState } from "react";
import { DriveFileObjectType } from "types";
import { uploadFile } from "api";
import moment from "moment";
import { fileSaver } from "utils/fileSaver";

export const UploaderModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { isLoggedIn } = useGoogleLogin();

  const [documents, setDocuments] = React.useState<DriveFileObjectType[]>([]);
  const [isFetchingGoogleDriveFiles, setIsFetchingGoogleDriveFiles] =
    useState(false);

  const [selectedItem, setSelectedItem] = useState<DriveFileObjectType | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [lastSearchTerm, setLastSearchTerm] = useState<string | null>(null);

  const [isFileUploading, setIsFileUploading] = useState(false);

  const handleClose = () => {
    onClose();
    setSearchTerm("");
    setSelectedItem(null);
    setLastSearchTerm(null);
    setDocuments([]);
  };

  const clearSearch = () => {
    if (lastSearchTerm) {
      listFiles(null);
    }
    setSearchTerm("");
    setLastSearchTerm(null);
  };

  const listFiles = async (searchTerm: string | null) => {
    setIsFetchingGoogleDriveFiles(true);
    setLastSearchTerm(searchTerm);

    gapi.client.drive.files
      .list({
        pageSize: 6,
        fields: "nextPageToken, files(id, name, mimeType, modifiedTime)",
        q: searchTerm ? `name contains '${searchTerm}'`: undefined,
      })
      .then(function (response: any) {
        setIsFetchingGoogleDriveFiles(false);

        const res = JSON.parse(response.body);
        setDocuments(res.files);
      });
  };

  useEffect(() => {
    if (isOpen) listFiles(null);
  }, [isOpen]);

  const selectItem = (i: number) => {
    setSelectedItem(documents[i]);
  };

  const submitFile = async () => {
    if (!selectedItem) return;
    try {
      setIsFileUploading(true);
      const request = await gapi.client.drive.files.get({
        fileId: selectedItem.id,
        alt: "media",
      });

      let binary = request.body
      let l = binary.length
      let array = new Uint8Array(l);
      for (var i = 0; i<l; i++){
        array[i] = binary.charCodeAt(i);
      }
      let blob = new Blob([array], {type: 'application/octet-stream'});

      await uploadFile({
        formData: blob,
        mimeType: selectedItem.mimeType,
        name: selectedItem.name,
      });

      handleClose();
    } catch (err) {
      alert("File not available for download");
    }
    setIsFileUploading(false);
  };

  if (!isLoggedIn) return <></>;

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={isOpen}
        onClose={handleClose}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <DialogContent>
          <Typography variant="h5" component="div" sx={{ mb: 1 }}>
            Select Files
          </Typography>
          <Typography variant="body2">
            Select the files you want to upload.
          </Typography>
          <br />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <TextField
              label="Search Document"
              color="primary"
              size="small"
              fullWidth
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {(lastSearchTerm ||
                      (searchTerm && searchTerm?.length > 0)) && (
                      <Button size="small" onClick={clearSearch}>
                        clear
                      </Button>
                    )}
                  </InputAdornment>
                ),
              }}
            />
            <Button size="large" onClick={() => listFiles(searchTerm)}>
              Search
            </Button>
          </div>
          <br />

          {isFetchingGoogleDriveFiles ? (
            <div style={{ display: "flex" }}>
              <CircularProgress sx={{ marginX: "auto" }} />
            </div>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 400 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="left">Last Modified</TableCell>
                    <TableCell align="right">-</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.map((row, i) => (
                    <TableRow
                      key={row.name}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="left">
                        {moment(row.modifiedTime).fromNow()}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          onClick={() => selectItem(i)}
                          disabled={Boolean(
                            selectedItem && selectedItem.id === row.id
                          )}
                        >
                          {selectedItem && selectedItem.id === row.id
                            ? "Selected"
                            : "Select"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: "1.5rem",
          }}
        >
          {selectedItem ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              <span>File selected</span>
              <Button size="small" onClick={() => setSelectedItem(null)}>
                clear
              </Button>
            </Stack>
          ) : (
            <>&nbsp;</>
          )}
          <Stack direction="row" spacing={1}>
            <Button onClick={handleClose}>Close</Button>
            <Button
              variant="outlined"
              color="primary"
              disabled={!selectedItem}
              onClick={submitFile}
            >
              Add Files
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 2 }}
        open={isFileUploading}
      >
        <CircularProgress color="inherit" />
        &nbsp; Uploading File
      </Backdrop>
    </>
  );
};
