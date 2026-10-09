
"use client";

import React, { useEffect, useState } from "react";
import { createWorkshop, updateWorkshop } from "./workshopService";
import "./WorkshopForm.css";

const emptyForm = {
  workshopCode: "",
  title: "",
  instructor: "",
  location: "Centre 01",
  dateTime: "",
  capacity: 20,
  status: "scheduled",
};

const toLocalDateTime = (value) => {
  if (!value) return "";

  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 16);
};

const WorkshopForm = ({ editing, onSaved, onCancel }) => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        workshopCode: editing.workshopCode,
        title: editing.title,
        instructor: editing.instructor,
        location: editing.location,
        dateTime: toLocalDateTime(editing.dateTime),
        capacity: editing.capacity,
        status: editing.status,
      });
    } else {
      setForm({ ...emptyForm });
    }

    setError("");
  }, [editing]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        capacity: Number(form.capacity),
        dateTime: new Date(form.dateTime).toISOString(),
      };

      if (editing) {
        await updateWorkshop(editing._id, payload);
      } else {
        await createWorkshop(payload);
      }

      setForm({ ...emptyForm });
      await onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="workshop-form-section">
      <div className="workshop-form-heading">
        <h2>{editing ? "Edit Workshop" : "Create Workshop"}</h2>
        <p>Enter the workshop information below.</p>
      </div>

      <form onSubmit={handleSubmit} className="workshop-form">
        <div className="workshop-form-grid">
          <label>
            Workshop Code
            <input
              name="workshopCode"
              value={form.workshopCode}
              onChange={handleChange}
              placeholder="WS001"
              required
            />
          </label>

          <label>
            Workshop Title
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Pottery Basics"
              required
            />
          </label>

          <label>
            Instructor
            <input
              name="instructor"
              value={form.instructor}
              onChange={handleChange}
              placeholder="Instructor name"
              required
            />
          </label>

          <label>
            Location
            <select
              name="location"
              value={form.location}
              onChange={handleChange}
            >
              <option>Centre 01</option>
              <option>Centre 02</option>
              <option>Centre 03</option>
            </select>
          </label>

          <label>
            Date & Time
            <input
              type="datetime-local"
              name="dateTime"
              value={form.dateTime}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Capacity
            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              min="1"
              step="1"
              required
            />
          </label>

          <label>
            Status
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
        </div>

        {error && <p className="workshop-form-error">{error}</p>}

        <div className="workshop-form-actions">
          <button type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : editing
              ? "Update Workshop"
              : "Create Workshop"}
          </button>

          <button
            type="button"
            className="workshop-cancel-button"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
};

export default WorkshopForm;
