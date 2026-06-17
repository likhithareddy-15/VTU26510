import React, { Component, useEffect } from "react";
import { NotificationsPage } from "./pages/NotificationsPage";
import { logger } from "./middleware/logger";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import "./App.css";

// Modern, clean theme matching high-end design principles
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#475569",
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    try {
      logger.log("ERROR_OCCURRED", {
        context: "ErrorBoundary",
        message: error?.message || String(error),
      });
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "32px", maxWidth: "800px", margin: "40px auto", fontFamily: "system-ui, sans-serif" }}>
          <div style={{ backgroundColor: "#fee2e2", border: "1px solid #fca5a5", borderRadius: "12px", padding: "24px", color: "#991b1b" }}>
            <h2 style={{ marginTop: 0 }}>⚠️ Application Runtime Crash</h2>
            <p style={{ fontWeight: 500 }}>The following rendering error was caught by the Error Boundary:</p>
            <pre style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "8px", border: "1px solid #f87171", overflowX: "auto", fontSize: "0.875rem", fontFamily: "monospace", color: "#7f1d1d" }}>
              {this.state.error?.stack || this.state.error?.message || String(this.state.error)}
            </pre>
            <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
              <button 
                onClick={() => window.location.reload()}
                style={{ padding: "10px 20px", cursor: "pointer", background: "#991b1b", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold" }}
              >
                Reload Page
              </button>
              <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                style={{ padding: "10px 20px", cursor: "pointer", background: "#4b5563", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold" }}
              >
                Clear Cache & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  useEffect(() => {
    // Log application startup
    logger.log("APP_STARTUP", {
      environment: "development",
      timestamp: new Date().toISOString(),
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <NotificationsPage />
      </ErrorBoundary>
    </ThemeProvider>
  );
}