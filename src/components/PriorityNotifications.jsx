import { Paper, Stack, Typography, Box } from "@mui/material";
import { PriorityHigh as PriorityIcon } from "@mui/icons-material";
import { NotificationCard } from "./NotificationCard";

export function PriorityNotifications({ notifications, onMarkRead, onMarkUnread }) {
  if (!notifications || notifications.length === 0) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid #b3e5fc",
        backgroundColor: "#e1f5fe",
        mb: 4,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "info.main",
            borderRadius: "50%",
            width: 32,
            height: 32,
          }}
        >
          <PriorityIcon sx={{ color: "#ffffff", fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={700} color="info.dark">
            Priority Inbox ({notifications.length})
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            Important placement announcements, followed by results and campus events (newest first).
          </Typography>
        </Box>
      </Stack>
      
      <Stack spacing={2}>
        {notifications.map((n) => (
          <NotificationCard
            key={`priority-${n.id}`}
            notification={n}
            onMarkRead={onMarkRead}
            onMarkUnread={onMarkUnread}
          />
        ))}
      </Stack>
    </Paper>
  );
}
