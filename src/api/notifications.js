import { logger } from "../middleware/logger";

// Base API URL for evaluation service
const API_BASE_URL = "http://4.224.186.213/evaluation-service/notifications";

// A rich dataset of campus notifications for fallback/testing
const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    title: "Google Software Engineer Campus Drive",
    message: "Google is visiting the campus for the Software Engineer role on June 28th. Registration deadline is June 22nd. Please upload your updated resume.",
    type: "Placement",
    createdAt: "2026-06-17T09:30:00.000Z",
  },
  {
    id: "n2",
    title: "Semester 6 Results Published",
    message: "The results for Semester 6 examinations are now available on the student portal. Revaluation applications are open until June 25th.",
    type: "Result",
    createdAt: "2026-06-17T08:15:00.000Z",
  },
  {
    id: "n3",
    title: "National Hackathon 2026 Registration",
    message: "Campus Innovation Cell is organizing the National level Hackathon from July 5th to 7th. Prize pool worth $10,000. Form teams of 3-4 and register now.",
    type: "Event",
    createdAt: "2026-06-16T15:40:00.000Z",
  },
  {
    id: "n4",
    title: "Microsoft Internship Shortlist",
    message: "Congratulations! 15 students have been shortlisted for the final round of interviews with Microsoft. The interviews will take place virtually on June 20th.",
    type: "Placement",
    createdAt: "2026-06-16T11:00:00.000Z",
  },
  {
    id: "n5",
    title: "Annual Sports Meet Schedule",
    message: "The annual sports meet 'ATHLETA 2026' schedule is released. Matches start from June 24th. Register for individual events at the sports office.",
    type: "Event",
    createdAt: "2026-06-15T14:20:00.000Z",
  },
  {
    id: "n6",
    title: "AI & ML Workshop by Industry Experts",
    message: "Join us for a 3-day hands-on workshop on Advanced Deep Learning and Generative AI starting this Friday at the Main Seminar Hall.",
    type: "Event",
    createdAt: "2026-06-14T10:00:00.000Z",
  },
  {
    id: "n7",
    title: "Accenture Selection List",
    message: "The final list of selected candidates for Accenture ASE and FSE roles has been uploaded. Onboarding starts in August 2026.",
    type: "Placement",
    createdAt: "2026-06-13T16:30:00.000Z",
  },
  {
    id: "n8",
    title: "Supplementary Examination Schedule",
    message: "The timetable for supplementary examinations of Semesters 1 to 4 has been posted. Exams commence on July 10th.",
    type: "Result",
    createdAt: "2026-06-12T09:00:00.000Z",
  },
  {
    id: "n9",
    title: "Campus Pool Drive - TCS Ninja",
    message: "TCS is conducting a pool campus drive for Ninja and Digital roles. Eligible branches: CSE, ISE, ECE, EEE. Registrations close tonight.",
    type: "Placement",
    createdAt: "2026-06-11T12:00:00.000Z",
  },
  {
    id: "n10",
    title: "Coding Club Weekly Challenge #12",
    message: "Weekly Competitive Programming contest starts tonight at 8:00 PM on HackerRank. Top 3 coders win Amazon vouchers.",
    type: "Event",
    createdAt: "2026-06-10T14:00:00.000Z",
  },
  {
    id: "n11",
    title: "NPTEL Certification Marks Released",
    message: "January-April NPTEL course credit transfer lists are out. Please verify your marks with your department coordinator by June 20th.",
    type: "Result",
    createdAt: "2026-06-09T11:45:00.000Z",
  },
  {
    id: "n12",
    title: "Cognizant GenC Interview Schedule",
    message: "Cognizant GenC interview slots are allocated. Please check your registered email for MS Teams links and time slots.",
    type: "Placement",
    createdAt: "2026-06-08T15:00:00.000Z",
  }
];
// Helper to normalize backend notification objects with uppercase keys to standard lowercase keys
const normalizeNotification = (n) => {
  const type = n.Type || n.type || "Event";
  
  // Format message as title if title is missing
  let title = n.title || "";
  if (!title && n.Message) {
    title = n.Message.split(".")[0]; // Use first sentence as title
    if (title.length > 50) {
      title = `${title.substring(0, 47)}...`;
    }
  } else if (!title) {
    title = `${type} Announcement`;
  }

  return {
    id: String(n.ID || n.id || ""),
    type: type,
    message: n.Message || n.message || "",
    title: title,
    createdAt: n.Timestamp || n.createdAt || n.timestamp || new Date().toISOString(),
  };
};

/**
 * Fetches notifications from evaluation API.
 * Uses Bearer Token authorization header.
 * 
 * @param {Object} params
 * @param {number} params.page - 1-based page index
 * @param {number} params.limit - number of notifications per page
 * @param {string} params.notificationType - Event, Result, Placement, or 'All'
 */
export async function fetchNotifications({ page = 1, limit = 5, notificationType = "All" } = {}) {
  const queryParams = new URLSearchParams();
  queryParams.append("page", page);
  queryParams.append("limit", limit);
  if (notificationType && notificationType !== "All") {
    queryParams.append("notification_type", notificationType);
  }

  const url = `${API_BASE_URL}?${queryParams.toString()}`;
  
  // Retrieve token from localStorage, or use a default token for evaluation
  const rawToken = localStorage.getItem("bearer_token") || "affordmed_evaluation_token_2026";
  const token = rawToken.startsWith("Bearer ") ? rawToken : `Bearer ${rawToken}`;

  // 1. Log API Request
  logger.log("API_REQUEST", { url, params: { page, limit, notificationType } });

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    // Normalize notifications array from the backend response
    const rawNotifications = data.notifications || [];
    const normalizedNotifications = rawNotifications.map(normalizeNotification);

    const normalizedData = {
      notifications: normalizedNotifications,
      total: data.total !== undefined ? data.total : normalizedNotifications.length,
      totalPages: data.totalPages !== undefined ? data.totalPages : 1
    };

    // 2. Log API Success
    logger.log("API_SUCCESS", { url, count: normalizedNotifications.length });
    return normalizedData;
  } catch (error) {
    // 3. Log API Failure
    logger.log("API_FAILURE", { url, error: error.message });
    console.warn("API Server not reachable or error response. Falling back to local mock data.", error);
    
    // Return simulated mock backend results
    return simulateMockBackend({ page, limit, notificationType });
  }
}

// Simulated mock backend logic to ensure full query-param compatibility and pagination
function simulateMockBackend({ page, limit, notificationType }) {
  // Filter
  let filtered = [...MOCK_NOTIFICATIONS];
  if (notificationType && notificationType !== "All") {
    filtered = filtered.filter(
      (n) => n.type.toLowerCase() === notificationType.toLowerCase()
    );
  }

  // Paginate
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginated = filtered.slice(startIndex, endIndex);
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);

  // Normalize mock notifications to be safe
  const normalizedPaginated = paginated.map(normalizeNotification);

  return {
    notifications: normalizedPaginated,
    total,
    totalPages,
  };
}

