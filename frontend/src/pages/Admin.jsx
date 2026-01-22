import React, { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Admin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.adminUsers().then(setUsers);
  }, []);

  const changeRole = async (id, role) => {
    const updated = await api.updateRole(id, role);
    setUsers(prev => prev.map(u => u.id === id ? updated : u));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">User Management</h2>

      <div className="overflow-hidden border rounded-lg bg-white shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.id}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <select
                    value={u.role}
                    onChange={e => changeRole(u.id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="p-3">
                  <span className="text-sm text-gray-500">updated</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
