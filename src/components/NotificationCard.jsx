import { Card, CardContent, Typography, Box, Button, Chip, Stack } from "@mui/material";
import {
  MarkEmailRead as MarkEmailReadIcon,
  MarkEmailUnread as MarkEmailUnreadIcon,
} from "@mui/icons-material";

// Helper to get type-specific color and labels
const getTypeStyle = (type) => {
  switch (type) {
    case "Placement":
      return { color: "primary", bgColor: "#e3f2fd", textColor: "#0d47a1" };
    case "Result":
      return { color: "warning", bgColor: "#fff3e0", textColor: "#e65100" };
    case "Event":
      return { color: "success", bgColor: "#e8f5e9", textColor: "#1b5e20" };
    default:
      return { color: "default", bgColor: "#f5f5f5", textColor: "#616161" };
  }
};

/**
 * Renders an individual notification card using Material UI.
 * Highlights unread items and provides actions to toggle read status.
 */
export function NotificationCard({ notification, onMarkRead, onMarkUnread }) {
  const { id, title, message, type, createdAt, isRead } = notification;
  const typeStyle = getTypeStyle(type);

  // Format the date/time nicely
  const formattedDate = new Date(createdAt).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card
      sx={{
        position: "relative",
        borderLeft: isRead ? "4px solid #cbd5e1" : "4px solid #1976d2",
        backgroundColor: isRead ? "#f8fafc" : "#ffffff",
        transition: "all 0.3s ease",
        boxShadow: isRead ? "none" : "0 4px 12px rgba(25, 118, 210, 0.08)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
        },
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.5}
          mb={1.5}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Chip
              label={type}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: "0.75rem",
                backgroundColor: typeStyle.bgColor,
                color: typeStyle.textColor,
                borderRadius: "6px",
              }}
            />
            {!isRead && (
              <Chip
                label="New"
                size="small"
                color="primary"
                sx={{
                  height: 18,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  borderRadius: "4px",
                  px: 0.5,
                }}
              />
            )}
          </Stack>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {formattedDate}
          </Typography>
        </Stack>

        <Typography
          variant="subtitle1"
          fontWeight={isRead ? 600 : 700}
          color={isRead ? "text.primary" : "primary.main"}
          gutterBottom
          sx={{ fontSize: "1.05rem", lineHeight: 1.3 }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, lineHeight: 1.5, fontSize: "0.9rem" }}
        >
          {message}
        </Typography>

        <Box display="flex" justifyContent="flex-end">
          {isRead ? (
            <Button
              size="small"
              variant="text"
              color="inherit"
              startIcon={<MarkEmailUnreadIcon />}
              onClick={() => onMarkUnread(id)}
              sx={{
                fontSize: "0.75rem",
                textTransform: "none",
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              Mark as Unread
            </Button>
          ) : (
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<MarkEmailReadIcon />}
              onClick={() => onMarkRead(id)}
              sx={{
                fontSize: "0.75rem",
                textTransform: "none",
                borderRadius: "8px",
                fontWeight: 600,
              }}
            >
              Mark as Read
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
