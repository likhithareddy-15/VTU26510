import { useState, useEffect } from "react";
import {
  Alert,
  Badge,
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  Paper,
  Grid,
  Button,
  ButtonGroup,
  Skeleton
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  FilterAltOff as ClearFiltersIcon,
  Refresh as RefreshIcon
} from "@mui/icons-material";

import { NotificationCard } from "../components/NotificationCard";
import { NotificationFilter } from "../components/NotificationFilter";
import { StatisticsCards } from "../components/StatisticsCards";
import { PriorityNotifications } from "../components/PriorityNotifications";
import { PaginationControls } from "../components/PaginationControls";
import { useNotifications } from "../hooks/useNotifications";
import { logger } from "../middleware/logger";

export function NotificationsPage() {
  const [filter, setFilter] = useState("All"); // Type filter: All, Placement, Result, Event
  const [readFilter, setReadFilter] = useState("All"); // Read filter: All, Read, Unread
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5); // Customizable page size

  const {
    notifications,
    priorityNotifications,
    total,
    totalPages,
    loading,
    error,
    markAsRead,
    markAsUnread,
    unreadCount,
  } = useNotifications(page, limit, filter);

  // Log page load on mount
  useEffect(() => {
    logger.log("PAGE_LOAD", { pageName: "NotificationsPage" });
  }, []);

  const handleFilterChange = (newFilter) => {
    logger.log("FILTER_CHANGE", { filterType: "Type", oldFilter: filter, newFilter });
    setFilter(newFilter);
    setPage(1); // Reset page on filter change
  };

  const handleReadFilterChange = (newReadFilter) => {
    logger.log("FILTER_CHANGE", { filterType: "ReadStatus", oldFilter: readFilter, newFilter: newReadFilter });
    setReadFilter(newReadFilter);
    setPage(1); // Reset page on filter change
  };

  const handlePageChange = (_, newPage) => {
    logger.log("PAGINATION_CHANGE", { oldPage: page, newPage });
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    logger.log("PAGINATION_CHANGE", { oldLimit: limit, newLimit });
    setLimit(newLimit);
    setPage(1);
  };

  const handleClearFilters = () => {
    logger.log("FILTER_CHANGE", { action: "ClearAll" });
    setFilter("All");
    setReadFilter("All");
    setPage(1);
  };

  // Local filtering for read/unread state
  const displayedNotifications = notifications.filter((n) => {
    if (readFilter === "Read") return n.isRead;
    if (readFilter === "Unread") return !n.isRead;
    return true;
  });

  // Calculate local page statistics for display
  const placementCount = notifications.filter((n) => n.type === "Placement").length;
  const resultCount = notifications.filter((n) => n.type === "Result").length;
  const eventCount = notifications.filter((n) => n.type === "Event").length;

  return (
    <Box sx={{ maxWidth: 1080, mx: "auto", px: { xs: 2, sm: 3 }, py: 4 }}>
      {/* Header Section */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={4}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Badge badgeContent={unreadCount} color="error" max={99}>
            <NotificationsIcon sx={{ fontSize: 36, color: "primary.main" }} />
          </Badge>
          <Box>
            <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ letterSpacing: "-0.5px" }}>
              Campus Notifications
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Stay updated with your campus placements, examination results, and event announcements
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={() => window.location.reload()}
          sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
        >
          Refresh Feed
        </Button>
      </Stack>

      {/* Stats Cards Section */}
      <StatisticsCards
        total={total}
        unread={unreadCount}
        placementCount={placementCount}
        resultCount={resultCount}
        eventCount={eventCount}
      />

      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={3}>
        {/* Controls Panel (Filters & Clear) */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "stretch", md: "center" },
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "center" }}>
              {/* Type Filter */}
              <Box>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                  Filter by Type:
                </Typography>
                <NotificationFilter value={filter} onChange={handleFilterChange} />
              </Box>

              {/* Read/Unread Filter */}
              <Box>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                  Read Status:
                </Typography>
                <ButtonGroup size="small" color="primary" aria-label="read status filters">
                  <Button
                    variant={readFilter === "All" ? "contained" : "outlined"}
                    onClick={() => handleReadFilterChange("All")}
                    sx={{ textTransform: "none", fontWeight: 600 }}
                  >
                    All
                  </Button>
                  <Button
                    variant={readFilter === "Unread" ? "contained" : "outlined"}
                    onClick={() => handleReadFilterChange("Unread")}
                    sx={{ textTransform: "none", fontWeight: 600 }}
                  >
                    Unread
                  </Button>
                  <Button
                    variant={readFilter === "Read" ? "contained" : "outlined"}
                    onClick={() => handleReadFilterChange("Read")}
                    sx={{ textTransform: "none", fontWeight: 600 }}
                  >
                    Read
                  </Button>
                </ButtonGroup>
              </Box>
            </Stack>

            {/* Clear Filter Action */}
            {(filter !== "All" || readFilter !== "All") && (
              <Button
                variant="text"
                color="error"
                startIcon={<ClearFiltersIcon />}
                onClick={handleClearFilters}
                sx={{ textTransform: "none", fontWeight: 600, alignSelf: { xs: "flex-end", md: "center" } }}
              >
                Clear Filters
              </Button>
            )}
          </Paper>
        </Grid>

        {/* Priority Section */}
        {!loading && !error && priorityNotifications.length > 0 && (
          <Grid item xs={12}>
            <PriorityNotifications
              notifications={priorityNotifications}
              onMarkRead={markAsRead}
              onMarkUnread={markAsUnread}
            />
          </Grid>
        )}

        {/* Main Feed Section */}
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight={700} mb={2} color="text.primary">
            {filter === "All" ? "All Feed" : `${filter} Feed`} 
            {readFilter !== "All" && ` • ${readFilter}`}
          </Typography>

          {/* Loading Skeletons */}
          {loading && (
            <Stack spacing={2}>
              <Skeleton variant="rectangular" height={100} sx={{ borderRadius: "8px" }} />
              <Skeleton variant="rectangular" height={100} sx={{ borderRadius: "8px" }} />
              <Skeleton variant="rectangular" height={100} sx={{ borderRadius: "8px" }} />
            </Stack>
          )}

          {/* Error State */}
          {!loading && error && (
            <Alert
              severity="error"
              sx={{ borderRadius: 3, py: 1.5 }}
              action={
                <Button color="inherit" size="small" onClick={() => window.location.reload()} sx={{ fontWeight: 700 }}>
                  Retry
                </Button>
              }
            >
              Failed to load notifications: {error}
            </Alert>
          )}

          {/* Empty State */}
          {!loading && !error && displayedNotifications.length === 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 6,
                textAlign: "center",
                borderRadius: 4,
                border: "1px dashed #cbd5e1",
                backgroundColor: "#f8fafc",
              }}
            >
              <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                No notifications found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                There are no notifications matching your active filters. Try clearing them to see all.
              </Typography>
              {(filter !== "All" || readFilter !== "All") && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleClearFilters}
                  sx={{ mt: 2, textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
                >
                  Clear Active Filters
                </Button>
              )}
            </Paper>
          )}

          {/* Notifications List */}
          {!loading && !error && displayedNotifications.length > 0 && (
            <Stack spacing={2}>
              {displayedNotifications.map((n) => (
                <NotificationCard
                  key={n.id}
                  notification={n}
                  onMarkRead={markAsRead}
                  onMarkUnread={markAsUnread}
                />
              ))}
            </Stack>
          )}
        </Grid>

        {/* Pagination Section */}
        {!loading && !error && (
          <Grid item xs={12}>
            <PaginationControls
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              limit={limit}
              onLimitChange={handleLimitChange}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
