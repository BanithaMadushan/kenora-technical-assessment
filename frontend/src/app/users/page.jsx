
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import UserForm from "./UserForm";
import UserList from "./UserList";
import { getUsers } from "./userService";

import "./users.css";

const Page = () => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.data);
      setError("");
    } catch (err) {
      setError(err.message);
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

      if (parsedUser.role !== "admin") {
        router.replace("/workshops");
        return;
      }

      setUser(parsedUser);
      loadUsers();
    } catch {
      router.replace("/login");
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <main className="users-page">
      <header className="users-navbar">
        <h2>WorkshopHub</h2>
        <div>
          <span>{user.name} · Admin</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="users-container">
        <div className="users-header">
          <span>ADMINISTRATION</span>
          <h1>User Management</h1>
          <p>Manage access to the workshop platform.</p>
        </div>

        <UserForm onCreated={loadUsers} />

        {error && <p className="users-error">{error}</p>}

        <UserList users={users} />
      </div>
    </main>
  );
};

export default Page;
