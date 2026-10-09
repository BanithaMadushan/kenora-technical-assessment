
"use client";

import React, { useEffect, useState } from "react";
import {
  getRegistrations,
  registerAttendee,
  cancelRegistration,
} from "./workshopService";
import "./RegistrationPanel.css";

const RegistrationPanel = ({ workshop, onChanged, onClose }) => {
  const [registrations, setRegistrations] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const loadRegistrations = async () => {
    try {
      const response = await getRegistrations(workshop._id);
      setRegistrations(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, [workshop._id]);

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await registerAttendee(workshop._id, {
        attendeeName: name,
        attendeeEmail: email,
      });

      setName("");
      setEmail("");
      setSuccess("Attendee registered successfully");

      await loadRegistrations();
      await onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this registration?")) return;

    setError("");
    setSuccess("");

    try {
      await cancelRegistration(id);

      setSuccess("Registration cancelled successfully");

      await loadRegistrations();
      await onChanged();
    } catch (err) {
      setError(err.message);
    }
  };

  const availableSeats = Math.max(
    0,
    workshop.capacity - workshop.registeredCount
  );

  return (
    <section className="registration-panel">
      <div className="registration-panel-header">
        <div>
          <h2>{workshop.title}</h2>
          <p>
            {workshop.workshopCode} · {availableSeats} seats available
          </p>
        </div>

        <button className="registration-close" onClick={onClose}>
          Close
        </button>
      </div>

      {workshop.status === "scheduled" && availableSeats > 0 && (
        <form
          onSubmit={handleRegister}
          className="registration-form"
        >
          <input
            placeholder="Attendee full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Attendee email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register Attendee"}
          </button>
        </form>
      )}

      {availableSeats === 0 && workshop.status === "scheduled" && (
        <p className="registration-full">
          This workshop is full. No seats available.
        </p>
      )}

      {error && <p className="registration-error">{error}</p>}
      {success && <p className="registration-success">{success}</p>}

      <h3>Registration History</h3>

      <div className="registration-history-scroll">
        <table className="registration-history-table">
          <thead>
            <tr>
              <th>Attendee</th>
              <th>Status</th>
              <th>Registered By / At</th>
              <th>Cancelled By / At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {registrations.length === 0 ? (
              <tr>
                <td colSpan="5">No registrations yet.</td>
              </tr>
            ) : (
              registrations.map((registration) => (
                <tr key={registration._id}>
                  <td>
                    <strong>{registration.attendeeName}</strong>
                    <small>{registration.attendeeEmail}</small>
                  </td>

                  <td>{registration.status}</td>

                  <td>
                    {registration.registeredBy?.name || "Unknown"}
                    <small>
                      {new Date(registration.registeredAt).toLocaleString()}
                    </small>
                  </td>

                  <td>
                    {registration.cancelledBy?.name || "-"}
                    <small>
                      {registration.cancelledAt
                        ? new Date(registration.cancelledAt).toLocaleString()
                        : "-"}
                    </small>
                  </td>

                  <td>
                    {registration.status === "active" && (
                      <button
                        className="registration-cancel"
                        onClick={() => handleCancel(registration._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RegistrationPanel;
