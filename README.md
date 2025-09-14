# User Management Dashboard

A full-stack web application where users can be added, viewed, edited, and deleted from a dashboard.  
Built with **React.js** on the frontend and **Node.js + Express + SQLite** on the backend.

---

## 🚀 Features

### Frontend
- Dashboard to view all users.
- Form to create new users with validation.
- Edit & delete user records.
- View user details on a separate page.
- Responsive, clean UI (supports mobile/desktop).

### Backend
- RESTful API (GET, POST, PUT, DELETE) for user data.
- Server-side validation for required fields and email format.
- SQLite database for persistence.
- Graceful error handling (user not found, invalid data, etc.).

---

## 🛠️ Tech Stack

| Layer      | Technology                |
|------------|---------------------------|
| Frontend   | React.js (Hooks, React Router), Axios |
| Backend    | Node.js, Express.js |
| Database   | SQLite |
| Styling    | Tailwind CSS / Bootstrap / Plain CSS (choose one) |

---

## 📂 Project Structure

user-management/
│
├── backend/ # Node.js + Express API
│ ├── server.js
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ └── database.sqlite
│
└── frontend/ # React app
├── src/
│ ├── components/
│ ├── api.js
│ ├── App.js
│ └── index.js
└── public/
