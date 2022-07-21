import { Typography } from "@mui/material";

export const DashboardHeader = ({
  email,
  name,
  description,
}: {
  email: string;
  name: string;
  description: string;
}) => (
  <>
    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
      {email}
    </Typography>
    <Typography variant="h5" component="div" sx={{ mb: 1 }}>
      Hello {name}
    </Typography>
    <Typography variant="body2" sx={{ mb: "1.5rem" }}>
      {description}
    </Typography>
  </>
);
