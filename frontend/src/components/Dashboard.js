import React, { useEffect, useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/${id}`);
      setUsers((s) => s.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="container">
      <div className="toolbar">
        <h2>Users</h2>
        <div>
          <button className="btn primary" onClick={() => nav("/users/new")}>+ Add User</button>
        </div>
      </div>

      {loading ? <p>Loading...</p> : (
        <>
          {users.length === 0 ? <p>No users found.</p> : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Company</th><th>City</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>{u.company}</td>
                    <td>{u.address_city}</td>
                    <td className="actions">
                      <Link to={`/users/${u.id}`}><button className="btn">View</button></Link>
                      <Link to={`/users/${u.id}/edit`}><button className="btn">Edit</button></Link>
                      <button className="btn danger" onClick={() => handleDelete(u.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
