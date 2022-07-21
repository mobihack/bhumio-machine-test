import {
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { formatBytes } from "utils/formatBytes";
import { FileObjectType } from "types";

export const FileListTable = ({
  files,
  onFileDownload,
}: {
  files: Array<FileObjectType>;
  onFileDownload: (i: number) => void;
}) => (
  <TableContainer>
    <Table sx={{ minWidth: 400 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell align="left">Name</TableCell>
          <TableCell align="left">Size&nbsp;(mb)</TableCell>
          <TableCell align="right">-</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {files.map((row, i) => (
          <TableRow
            key={row.name}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {row.name}
            </TableCell>
            <TableCell align="left">{formatBytes(Number(row.size))}</TableCell>
            <TableCell align="right">
              <Stack direction="row-reverse" spacing={1}>
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={() => onFileDownload(i)}
                >
                  <FileDownloadOutlinedIcon fontSize="inherit" />
                </IconButton>
              </Stack>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
