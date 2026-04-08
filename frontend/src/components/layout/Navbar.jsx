import { Search, Bell, User, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const notifications = [
    { id: 1, title: 'New Resource Added', desc: 'Quantum Physics 101 is now available.', time: '2h ago' },
    { id: 2, title: 'Review Received', desc: 'Someone commented on your resource.', time: '5h ago' },
    { id: 3, title: 'System Update', desc: 'Platform maintenance scheduled for tonight.', time: '1d ago' },
  ];

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  const handleAccountClick = () => {
    navigate('/dashboard/profile');
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 max-w-2xl relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search resources, authors, or subjects..."
            value={query}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl outline-none transition-all text-gray-900 placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                "p-2.5 rounded-xl transition-colors relative",
                showNotifications ? "bg-emerald-50 text-emerald-600" : "text-gray-500 hover:bg-gray-100"
              )}
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                      <span className="font-bold text-gray-900">Notifications</span>
                      <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={16} />
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className="p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer">
                          <p className="text-sm font-bold text-gray-900">{n.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{n.desc}</p>
                          <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">{n.time}</p>
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-3 text-xs font-bold text-emerald-600 hover:bg-emerald-50 transition-colors">
                      View All Notifications
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
          
          <button 
            onClick={handleAccountClick}
            className="flex items-center gap-2 p-1.5 pr-3 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
              <User size={18} />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">Account</span>
          </button>
        </div>
      </div>
    </header>
  );
}

// Helper for cn
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
