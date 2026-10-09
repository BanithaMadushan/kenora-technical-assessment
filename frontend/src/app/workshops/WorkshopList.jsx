
import React from "react";
import "./WorkshopList.css";

const WorkshopList = ({
  workshops,
  user,
  onEdit,
  onSelect,
}) => {
  return (
    <section className="workshop-list-section">
      <div className="workshop-list-heading">
        <h2>Workshop Catalogue</h2>
        <span>{workshops.length} workshops</span>
      </div>

      <div className="workshop-table-scroll">
        <table className="workshop-table">
          <thead>
            <tr>
              <th>Workshop</th>
              <th>Schedule</th>
              <th>Seats</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {workshops.length === 0 ? (
              <tr>
                <td colSpan="5">No workshops found.</td>
              </tr>
            ) : (
              workshops.map((workshop) => {
                const available = Math.max(
                  0,
                  workshop.capacity - workshop.registeredCount
                );

                return (
                  <tr key={workshop._id}>
                    <td>
                      <strong>{workshop.title}</strong>
                      <small>
                        {workshop.workshopCode} · {workshop.instructor}
                      </small>
                      <small>{workshop.location}</small>
                    </td>

                    <td>
                      {new Date(workshop.dateTime).toLocaleString()}
                    </td>

                    <td>
                      <strong>
                        {available} / {workshop.capacity}
                      </strong>
                      <small>Available seats</small>
                    </td>

                    <td>
                      <span
                        className={`workshop-status status-${workshop.status}`}
                      >
                        {workshop.status}
                      </span>
                    </td>

                    <td>
                      <div className="workshop-table-actions">
                        <button onClick={() => onSelect(workshop)}>
                          Registrations
                        </button>

                        {user?.role === "manager" && (
                          <button
                            className="workshop-edit-button"
                            onClick={() => onEdit(workshop)}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default WorkshopList;
