
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import WorkshopForm from "./WorkshopForm";
import WorkshopList from "./WorkshopList";
import RegistrationPanel from "./RegistrationPanel";
import { getWorkshops } from "./workshopService";

import "./workshops.css";

const initialFilters = {
  status: "",
  from: "",
  to: "",
  available: false,
};

const Page = () => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [workshops, setWorkshops] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadWorkshops = async (currentFilters = filters) => {
    try {
      setError("");
      const response = await getWorkshops(currentFilters);
      setWorkshops(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      router.replace("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      if (parsedUser.role === "admin") {
        router.replace("/users");
        return;
      }

      if (!["manager", "staff"].includes(parsedUser.role)) {
        router.replace("/login");
        return;
      }

      setUser(parsedUser);
      loadWorkshops(initialFilters);
    } catch {
      router.replace("/login");
    }
  }, [router]);

  const handleFilter = async (e) => {
    e.preventDefault();
    await loadWorkshops(filters);
  };

  const handleSaved = async () => {
    setShowForm(false);
    setEditing(null);
    await loadWorkshops(filters);
  };

  const handleEdit = (workshop) => {
    setEditing(workshop);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  const selectedWorkshop = workshops.find(
    (workshop) => workshop._id === selectedId
  );

  if (!user) {
    return <p className="workshop-loading">Loading...</p>;
  }

  return (
    <main className="workshops-page">
      <header className="workshops-navbar">
        <div className="workshops-logo">
          <span>W</span>
          <strong>WorkshopHub</strong>
        </div>

        <div className="workshops-account">
          <span>
            {user.name} · {user.role}
          </span>

          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="workshops-container">
        <div className="workshops-page-heading">
          <div>
            <span>WORKSHOP MANAGEMENT</span>
            <h1>Workshops</h1>
            <p>Manage sessions, registrations and available seats.</p>
          </div>

          {user.role === "manager" && (
            <button
              className="workshops-add-button"
              onClick={() => {
                setEditing(null);
                setShowForm(!showForm);
              }}
            >
              + New Workshop
            </button>
          )}
        </div>

        {showForm && user.role === "manager" && (
          <WorkshopForm
            editing={editing}
            onSaved={handleSaved}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        )}

        <form className="workshops-filters" onSubmit={handleFilter}>
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
          >
            <option value="">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <input
            type="date"
            value={filters.from}
            onChange={(e) =>
              setFilters({ ...filters, from: e.target.value })
            }
            aria-label="From date"
          />

          <input
            type="date"
            value={filters.to}
            onChange={(e) =>
              setFilters({ ...filters, to: e.target.value })
            }
            aria-label="To date"
          />

          <label className="workshops-available-filter">
            <input
              type="checkbox"
              checked={filters.available}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  available: e.target.checked,
                })
              }
            />
            Available only
          </label>

          <button type="submit">Apply Filters</button>

          <button
            type="button"
            className="workshops-reset"
            onClick={() => {
              setFilters(initialFilters);
              loadWorkshops(initialFilters);
            }}
          >
            Reset
          </button>
        </form>

        {error && <p className="workshops-error">{error}</p>}

        {loading ? (
          <p>Loading workshops...</p>
        ) : (
          <WorkshopList
            workshops={workshops}
            user={user}
            onEdit={handleEdit}
            onSelect={(workshop) => setSelectedId(workshop._id)}
          />
        )}

        {selectedWorkshop && (
          <RegistrationPanel
            workshop={selectedWorkshop}
            onChanged={() => loadWorkshops(filters)}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>
    </main>
  );
};

export default Page;
