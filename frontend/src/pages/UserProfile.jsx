import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, Settings, Camera } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../utils/helpers.jsx';

export default function UserProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      <Sidebar role="user" />
      <main className="flex-1 lg:ml-[260px] min-h-screen flex flex-col">
        <Navbar />
        <div className="p-6 lg:p-10 max-w-4xl mx-auto w-full space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
              <User size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-500">Manage your personal information and account settings</p>
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-emerald-500 to-indigo-600" />
            <div className="px-8 pb-8">
              <div className="relative -mt-12 mb-6">
                <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-lg">
                  <div className="w-full h-full rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 text-3xl font-bold">
                    {user?.email?.[0].toUpperCase()}
                  </div>
                </div>
                <button className="absolute bottom-0 left-20 p-2 bg-white rounded-xl shadow-md border border-gray-100 text-gray-500 hover:text-emerald-600 transition-colors">
                  <Camera size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-50">
                      <Mail size={18} className="text-gray-400" />
                      <span className="text-gray-900 font-medium">{user?.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Account Role</label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-50">
                      <Shield size={18} className="text-gray-400" />
                      <span className="text-gray-900 font-medium capitalize">{user?.role}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Member Since</label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-50">
                      <Calendar size={18} className="text-gray-400" />
                      <span className="text-gray-900 font-medium">October 2023</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Account Status</label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-50">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-gray-900 font-medium">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100 flex justify-end gap-4">
                <button className="px-6 py-3 bg-gray-50 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition-all">
                  Change Password
                </button>
                <button className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
