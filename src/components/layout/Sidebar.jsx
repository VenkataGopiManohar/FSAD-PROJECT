import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, Library, Bookmark, History, MessageSquare, Settings, Users, BarChart3, Menu, X, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/helpers.jsx';

export default function Sidebar({ role }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const adminLinks = [
    { name: 'Overview', icon: BarChart3, path: '/admin' },
    { name: 'Manage Resources', icon: Library, path: '/admin/resources' },
    { name: 'Manage Users', icon: Users, path: '/admin/users' },
    { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const userLinks = [
    { name: 'Explore Library', icon: Library, path: '/dashboard' },
    { name: 'My Bookmarks', icon: Bookmark, path: '/dashboard/bookmarks' },
    { name: 'Download History', icon: History, path: '/dashboard/history' },
    { name: 'Feedback', icon: MessageSquare, path: '/dashboard/feedback' },
    { name: 'Profile', icon: Settings, path: '/dashboard/profile' },
  ];

  const links = role === 'admin' ? adminLinks : userLinks;

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 260 : 0, opacity: isOpen ? 1 : 0 }}
        className={cn(
          "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-40 overflow-hidden flex flex-col",
          !isOpen && "pointer-events-none"
        )}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center">
              <BookOpen className="text-white" size={18} />
            </div>
            <span className="text-xl font-bold text-gray-900">EduLib</span>
          </div>

          <nav className="space-y-1">
            {links.map((link) => (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors group"
              >
                <link.icon size={20} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">{link.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-6 px-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-gray-900 truncate">{user?.email}</span>
              <span className="text-xs text-gray-500 capitalize">{role}</span>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
