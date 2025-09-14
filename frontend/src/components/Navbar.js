import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">User Management Dashboard</div>
      <div className="links">
        <Link to="/users">Dashboard</Link>
        <Link to="/users/new">Add User</Link>
      </div>
    </nav>
  );
}
