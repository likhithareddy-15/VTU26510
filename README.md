# Campus Notifications Dashboard

## Overview

Campus Notifications Dashboard is a React-based web application designed to help students stay updated with important campus announcements, placement opportunities, examination results, and event notifications.

The application provides a clean and responsive interface with notification prioritization, filtering options, read/unread tracking, pagination, and integrated logging middleware.

---

## Features

### Priority Notifications
- Displays high-priority notifications separately.
- Prioritization order:
  - Placement
  - Result
  - Event
- Latest notifications appear first.

### Notification Management
- View all notifications.
- Read/Unread status tracking.
- Mark notifications as read.

### Filtering
Filter notifications by:
- Placement
- Result
- Event

Filter notifications based on:
- All
- Read
- Unread

### Statistics Dashboard
Displays:
- Total Notifications
- Unread Notifications
- Placement Notifications
- Result Notifications

### Pagination
- Navigate between pages.
- Configurable notifications per page.

### Responsive UI
- Desktop-friendly layout.
- Mobile-friendly design.
- Material UI components.

### Logging Middleware
Logs:
- Application startup
- API requests
- API responses
- Errors
- Filter changes
- Pagination actions
- User interactions

---

## Technology Stack

### Frontend
- React
- Vite
- JavaScript

### UI Library
- Material UI (MUI)

### State Management
- React Hooks

### Logging
- Custom Logging Middleware

---

## Project Structure

```text
src/
├── api/
│   └── notificationsApi.js
│
├── components/
│   ├── NotificationCard.jsx
│   ├── NotificationFilter.jsx
│   ├── PriorityNotifications.jsx
│   ├── StatisticsCards.jsx
│   └── PaginationControls.jsx
│
├── hooks/
│   └── useNotifications.js
│
├── middleware/
│   └── logger.js
│
├── pages/
│   └── NotificationsPage.jsx
│
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/affordmedtest/Campus-Evaluation-FE
```

### Navigate to Project

```bash
cd notification-app-fe
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev

### Open Application

http://localhost:3000

## Functionalities Implemented

### Notification Retrieval
- Fetches notifications from the provided API.
- Supports pagination.
- Supports notification type filtering.

### Notification Categories
- Placement
- Result
- Event

### Read Status Management
- Read Notifications
- Unread Notifications

### Priority Inbox
- Displays top-priority notifications separately.
- Sorted using notification type priority and recency.

### Error Handling
- User-friendly error messages.
- Retry support.
- Safe API handling.

### Loading States
- Loading indicators while fetching data.


## User Interface Components

### Dashboard Header
Displays:
- Application title
- Notification summary
- Refresh functionality

### Statistics Cards
Displays:
- Total Notifications
- Unread Notifications
- Placement Count
- Result Count

### Filters Section
Supports:
- Type filtering
- Read status filtering

### Priority Inbox
Highlights important notifications.

### Notifications List
Displays complete notification feed.

### Pagination Controls
Supports page navigation.

## Future Enhancements

- Search functionality
- Notification bookmarking
- Dark mode support
- Real-time notification updates
- User preferences
- Push notifications

## Author

Developed as part of a Frontend Notification Dashboard implementation using React, Material UI, and custom logging middleware.
