import { Grid, Paper, Box, Typography, Stack } from "@mui/material";
import {
  Notifications as NotificationsIcon,
  NotificationsActive as ActiveIcon,
  Work as PlacementIcon,
  Assessment as ResultIcon,
  Event as EventIcon
} from "@mui/icons-material";

export function StatisticsCards({ total, unread, placementCount, resultCount, eventCount }) {
  const stats = [
    {
      label: "Total Notifications",
      value: total,
      icon: <NotificationsIcon sx={{ fontSize: 28, color: "#1976d2" }} />,
      bgColor: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
      borderColor: "#90caf9",
    },
    {
      label: "Unread Notifications",
      value: unread,
      icon: <ActiveIcon sx={{ fontSize: 28, color: "#d32f2f" }} />,
      bgColor: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
      borderColor: "#ef9a9a",
    },
    {
      label: "Placements",
      value: placementCount,
      icon: <PlacementIcon sx={{ fontSize: 28, color: "#0d47a1" }} />,
      bgColor: "linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)",
      borderColor: "#9fa8da",
    },
    {
      label: "Results",
      value: resultCount,
      icon: <ResultIcon sx={{ fontSize: 28, color: "#e65100" }} />,
      bgColor: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
      borderColor: "#ffcc80",
    },
  ];

  return (
    <Grid container spacing={2} mb={4}>
      {stats.map((stat, idx) => (
        <Grid item xs={12} sm={6} md={3} key={idx}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              background: stat.bgColor,
              border: `1px solid ${stat.borderColor}`,
              boxShadow: "none",
              transition: "transform 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
              },
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
                  {stat.label}
                </Typography>
                <Typography variant="h4" fontWeight={800} color="text.primary">
                  {stat.value}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 1.5,
                  borderRadius: "12px",
                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                }}
              >
                {stat.icon}
              </Box>
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
