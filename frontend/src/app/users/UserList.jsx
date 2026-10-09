import React from "react";
import "./UserList.css";

const UserList = ({ users }) => {
  return (
    <section className="user-list-section">
      <h2>Team Members ({users.length})</h2>

      <div className="user-list-scroll">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className="user-role">{user.role}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default UserList;