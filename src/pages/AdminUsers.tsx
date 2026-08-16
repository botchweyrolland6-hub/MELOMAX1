import React, { useState } from 'react';
import type { User } from '../types';
import { Users, Search, Shield, UserCheck, UserX, Trash2 } from 'lucide-react';

interface AdminUsersProps {
  users: User[];
  onToggleStatus: (id: string) => void;
  onDeleteUser: (id: string, name: string) => void;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ users, onToggleStatus, onDeleteUser }) => {
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search))
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <Users className="w-6 h-6 text-purple-400" />
            <span>Registered Users Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage customer accounts, verify contact details, enable/disable portal access.
          </p>
        </div>

        <div className="w-full md:w-72 relative text-xs">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider">
                <th className="py-4 px-4">User Name</th>
                <th className="py-4 px-4">Email Address</th>
                <th className="py-4 px-4">Phone Number</th>
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-4">Account Status</th>
                <th className="py-4 px-4">Registration Date</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/50 transition">
                  <td className="py-3 px-4 font-bold text-white flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 font-bold shrink-0">
                      {u.full_name.charAt(0).toUpperCase()}
                    </div>
                    <span>{u.full_name}</span>
                  </td>

                  <td className="py-3 px-4 text-slate-300 font-medium">{u.email}</td>
                  <td className="py-3 px-4 text-slate-400 font-mono">{u.phone || 'N/A'}</td>

                  <td className="py-3 px-4">
                    {u.role === 'admin' ? (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-extrabold uppercase inline-flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Admin
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-extrabold uppercase">
                        Customer
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {u.status === 'active' ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase inline-flex items-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-extrabold uppercase inline-flex items-center gap-1">
                        <UserX className="w-3 h-3" />
                        Disabled
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-slate-400">
                    {new Date(u.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>

                  <td className="py-3 px-4 text-right">
                    {u.role !== 'admin' && (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onToggleStatus(u.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold transition text-xs ${
                            u.status === 'active'
                              ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                          }`}
                        >
                          {u.status === 'active' ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          onClick={() => onDeleteUser(u.id, u.full_name)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                          title="Delete User Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
