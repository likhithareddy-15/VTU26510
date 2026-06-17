import { useState, useEffect } from "react";
import { fetchNotifications } from "../api/notifications";
import { logger } from "../middleware/logger";

/**
 * Custom hook to fetch and manage notifications state.
 * Supports filtering, pagination, and read/unread status persistence.
 * 
 * @param {number} page - Current active page (1-indexed)
 * @param {number} limit - Number of notifications per page
 * @param {string} filter - Notification type filter ('All', 'Event', 'Result', 'Placement')
 */
export function useNotifications(page = 1, limit = 5, filter = "All") {
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve read notifications list from localStorage
  const [readIds, setReadIds] = useState(() => {
    try {
      const stored = localStorage.getItem("read_notification_ids");
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to read read_notification_ids from localStorage:", e);
      return [];
    }
  });

  // Fetch notifications whenever page, limit, or filter changes
  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNotifications({ page, limit, notificationType: filter });
        if (active) {
          setNotifications(data.notifications ?? []);
          setTotal(data.total ?? 0);
          setTotalPages(data.totalPages ?? 0);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to load notifications");
          logger.log("ERROR_OCCURRED", { context: "Fetch Notifications Hook", message: err.message });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [page, limit, filter]);

  // Sync readIds to localStorage
  const updateReadIdsInStorage = (updatedIds) => {
    setReadIds(updatedIds);
    try {
      localStorage.setItem("read_notification_ids", JSON.stringify(updatedIds));
    } catch (e) {
      console.error("Failed to save read_notification_ids to localStorage:", e);
    }
  };

  // Mark a notification as read
  const markAsRead = (id) => {
    if (!readIds.includes(id)) {
      const updated = [...readIds, id];
      updateReadIdsInStorage(updated);
      logger.log("NOTIFICATION_READ", { notificationId: id });
    }
  };

  // Mark a notification as unread
  const markAsUnread = (id) => {
    if (readIds.includes(id)) {
      const updated = readIds.filter((item) => item !== id);
      updateReadIdsInStorage(updated);
      logger.log("NOTIFICATION_UNREAD", { notificationId: id });
    }
  };

  // Enrich notifications with isRead property
  const enrichedNotifications = notifications.map((n) => ({
    ...n,
    isRead: readIds.includes(n.id),
  }));

  // Define the priority order mapping for notification types
  const typePriorityMap = {
    Placement: 3,
    Result: 2,
    Event: 1,
  };

  // Calculate priority notifications: top unread notifications sorted by type priority, then newest first
  const priorityNotifications = enrichedNotifications
    .filter((n) => !n.isRead)
    .sort((a, b) => {
      const pA = typePriorityMap[a.type] || 0;
      const pB = typePriorityMap[b.type] || 0;
      
      // If priorities differ, sort by type priority (highest first)
      if (pB !== pA) {
        return pB - pA;
      }
      // If priorities are same, sort by date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    .slice(0, 3); // limit to top 3 unread


  // Calculate total unread count in current view or overall
  // If we want a dynamic count, we can do it relative to the current total notifications.
  // Since we only have total count from the server response, we can estimate/calculate the total unread.
  // For the purpose of the badge, let's count all unread notifications in the currently loaded list.
  const unreadCount = enrichedNotifications.filter((n) => !n.isRead).length;

  return {
    notifications: enrichedNotifications,
    priorityNotifications,
    total,
    totalPages,
    loading,
    error,
    markAsRead,
    markAsUnread,
    unreadCount,
  };
}
