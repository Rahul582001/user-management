import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import UserForm from "./components/UserForm";
import UserDetails from "./components/UserDetails";
import EditUser from "./components/EditUser";

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<Dashboard />} />
          <Route path="/users/new" element={<UserForm />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="/users/:id/edit" element={<EditUser />} />
        </Routes>
      </main>
    </div>
  );
}
