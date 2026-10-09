
"use client";

import React, { useState } from "react";
import { createUser } from "./userService";
import "./UserForm.css";

const UserForm = ({ onCreated }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await createUser(form);

      setSuccess("Account created successfully");
      setForm({
        name: "",
        email: "",
        password: "",
        role: "staff",
      });

      await onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="user-form-section">
      <h2>Create Staff Account</h2>
      <p>Only administrators can create staff accounts.</p>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Full name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <input
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          minLength={6}
          required
        />

        <select
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="staff">Staff</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>

        <button disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>

      {error && <p className="user-message-error">{error}</p>}
      {success && <p className="user-message-success">{success}</p>}
    </section>
  );
};

export default UserForm;
