import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000/api";

export default axios.create({
  baseURL: `${API_BASE}/users`,
  headers: { "Content-Type": "application/json" }
});
