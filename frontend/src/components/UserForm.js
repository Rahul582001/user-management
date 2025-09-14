import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const empty = {
  name: "",
  email: "",
  phone: "",
  company: "",
  address: { street: "", city: "", zip: "", geo: { lat: "", lng: "" } }
};

export default function UserForm() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function setPath(path, value) {
    // simple nested update helper
    setForm(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let cur = copy;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
      cur[keys[keys.length - 1]] = value;
      return copy;
    });
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Email is invalid";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);

    try {
      await api.post("/", form);
      alert("User created");
      navigate("/users");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.error) alert(data.error);
        else if (data.errors) alert(data.errors.map(x => x.msg).join(", "));
      } else alert("Create failed");
    }
  }

  return (
    <div className="container">
      <h2>Create User</h2>
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Name</label>
            <input value={form.name} onChange={e => setPath("name", e.target.value)} />
          </div>
          {errors.name && <div style={{color:"red"}}>{errors.name}</div>}
          <div className="form-row">
            <label>Email</label>
            <input value={form.email} onChange={e => setPath("email", e.target.value)} />
          </div>
          {errors.email && <div style={{color:"red"}}>{errors.email}</div>}
          <div className="form-row">
            <label>Phone</label>
            <input value={form.phone} onChange={e => setPath("phone", e.target.value)} />
          </div>

          <div className="form-row">
            <label>Company</label>
            <input value={form.company} onChange={e => setPath("company", e.target.value)} />
          </div>

          <h4>Address</h4>
          <div className="form-row">
            <label>Street</label>
            <input value={form.address.street} onChange={e => setPath("address.street", e.target.value)} />
          </div>
          <div className="form-row">
            <label>City</label>
            <input value={form.address.city} onChange={e => setPath("address.city", e.target.value)} />
          </div>
          <div className="form-row">
            <label>Zip</label>
            <input value={form.address.zip} onChange={e => setPath("address.zip", e.target.value)} />
          </div>
          <div className="form-row">
            <label>Geo Lat</label>
            <input value={form.address.geo.lat} onChange={e => setPath("address.geo.lat", e.target.value)} />
          </div>
          <div className="form-row">
            <label>Geo Lng</label>
            <input value={form.address.geo.lng} onChange={e => setPath("address.geo.lng", e.target.value)} />
          </div>

          <div style={{marginTop:12}}>
            <button type="submit" className="btn primary">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
