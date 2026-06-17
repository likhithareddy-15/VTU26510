/**
 * Logging Middleware for AffordMed Campus Evaluation
 * Logs key application events to the console and persists them in localStorage.
 */
export const logger = {
  log: (event, details = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
    };
    
    // Beautiful formatted console log
    console.log(
      `%c[LOG] %c[${logEntry.timestamp}] %c[${event}]`,
      "color: #2196f3; font-weight: bold;",
      "color: #9e9e9e;",
      "color: #4caf50; font-weight: bold;",
      details
    );

    try {
      const logs = JSON.parse(localStorage.getItem("campus_app_logs") || "[]");
      logs.push(logEntry);
      // Keep only the latest 100 logs
      if (logs.length > 100) {
        logs.shift();
      }
      localStorage.setItem("campus_app_logs", JSON.stringify(logs));
    } catch (error) {
      console.warn("Failed to write log to localStorage:", error);
    }
  },
};
