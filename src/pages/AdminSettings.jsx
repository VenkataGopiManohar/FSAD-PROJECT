import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { Settings, Shield, Bell, Globe, Lock } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      <Sidebar role="admin" />
      <main className="flex-1 lg:ml-[260px] min-h-screen flex flex-col">
        <Navbar />
        <div className="p-6 lg:p-10 max-w-4xl mx-auto w-full space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-600">
              <Settings size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
              <p className="text-gray-500">Configure global library parameters and security</p>
            </div>
          </div>

          <div className="space-y-6">
            {[
              { title: 'General Configuration', icon: Globe, desc: 'Manage site name, language, and time zone' },
              { title: 'Security & Access', icon: Shield, desc: 'Configure password policies and role permissions' },
              { title: 'Notification System', icon: Bell, desc: 'Manage automated emails and system alerts' },
              { title: 'API & Integrations', icon: Lock, desc: 'Manage external service connections and keys' },
            ].map(item => (
              <div key={item.title} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-emerald-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-all">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm font-bold text-emerald-600 bg-emerald-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                  Configure
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
