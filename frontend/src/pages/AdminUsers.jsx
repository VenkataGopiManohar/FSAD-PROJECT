import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, Shield, MoreVertical, Search } from 'lucide-react';
import { cn } from '../utils/helpers.jsx';

export default function AdminUsers() {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('edulib_all_users');
    return saved ? JSON.parse(saved) : [
      { id: '1', email: 'admin@edulib.com', role: 'admin', joinedAt: '2023-01-01', status: 'active' },
      { id: '2', email: 'student@test.com', role: 'user', joinedAt: '2023-11-15', status: 'active' },
      { id: '3', email: 'jane.doe@example.com', role: 'user', joinedAt: '2023-12-01', status: 'suspended' },
    ];
  });

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'active' ? 'suspended' : 'active' };
      }
      return u;
    }));
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      <Sidebar role="admin" />
      <main className="flex-1 lg:ml-[260px] min-h-screen flex flex-col">
        <Navbar />
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-500 mt-1">Manage access and permissions for all members</p>
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search users by email..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl outline-none transition-all text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-50 text-gray-600 text-sm font-bold rounded-xl border border-gray-100">Filter</button>
                <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-600/20">Export CSV</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">User</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined Date</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                            {user.email[0].toUpperCase()}
                          </div>
                          <span className="font-bold text-gray-900">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          {user.role === 'admin' ? <Shield size={14} className="text-rose-500" /> : <Users size={14} className="text-emerald-500" />}
                          <span className="text-sm font-medium capitalize text-gray-600">{user.role}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-500">{new Date(user.joinedAt).toLocaleDateString()}</td>
                      <td className="px-8 py-5">
                        <span className={cn(
                          "px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider",
                          user.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        )}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => toggleStatus(user.id)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                            user.status === 'active' 
                              ? "text-red-600 border-red-100 hover:bg-red-50" 
                              : "text-emerald-600 border-emerald-100 hover:bg-emerald-50"
                          )}
                        >
                          {user.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
