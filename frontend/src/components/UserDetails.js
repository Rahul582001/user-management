import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
        alert("User not found");
        nav("/users");
      }
    })();
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>User Details</h2>
      <div className="form-card">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Company:</strong> {user.company}</p>
        <p><strong>Address:</strong> {user.address_street}, {user.address_city} - {user.address_zip}</p>
        <p><strong>Geo:</strong> {user.geo_lat}, {user.geo_lng}</p>

        <div style={{marginTop:12}}>
          <Link to={`/users/${user.id}/edit`}><button className="btn">Edit</button></Link>
          <Link to="/users"><button className="btn">Back</button></Link>
        </div>
      </div>
    </div>
  );
}
