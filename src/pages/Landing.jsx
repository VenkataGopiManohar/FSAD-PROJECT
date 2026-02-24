import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Search, Shield, Globe, Users, Download, Library, User, LogOut } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const features = [
    {
      title: 'Curated Content',
      desc: 'Access verified textbooks, research papers, and study guides from top institutions.',
      icon: BookOpen,
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      title: 'Smart Search',
      desc: 'Find exactly what you need with our advanced filtering and categorization system.',
      icon: Search,
      color: 'bg-teal-50 text-teal-600'
    },
    {
      title: 'Secure Access',
      desc: 'Role-based access ensures that resources are managed and accessed appropriately.',
      icon: Shield,
      color: 'bg-emerald-50 text-emerald-600'
    }
  ];

  const stats = [
    { label: 'Resources', value: '10k+' },
    { label: 'Active Users', value: '50k+' },
    { label: 'Downloads', value: '200k+' },
    { label: 'Institutions', value: '150+' }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-[#10B981] rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <BookOpen className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">EduLib</span>
          </div>
          
          <div className="flex items-center gap-8">
            {user ? (
              <>
                <button 
                  onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  <User size={18} />
                  Dashboard
                </button>
                <button 
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="text-sm font-semibold text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="px-6 py-2.5 bg-[#10B981] text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50/50 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-teal-50/50 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
          >
            Empowering Education Everywhere
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] mb-8"
          >
            Access the World's <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400">
              Knowledge Library
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-gray-500 leading-relaxed mb-12"
          >
            A centralized hub for students and educators to discover, share, and 
            access high-quality educational resources across all disciplines.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => navigate(user ? '/dashboard' : '/register')}
              className="w-full sm:w-auto px-8 py-4 bg-[#10B981] text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 group"
            >
              Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl border border-gray-200 hover:border-emerald-600 hover:text-emerald-600 transition-all shadow-sm"
            >
              Browse Resources
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-20 relative rounded-[40px] overflow-hidden shadow-2xl border-8 border-white"
          >
            <img 
              src="https://picsum.photos/seed/library/1200/600" 
              alt="Library Preview" 
              className="w-full h-auto object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <p className="text-4xl md:text-5xl font-black mb-2 text-emerald-400">{stat.value}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center">
                <BookOpen className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold text-gray-900">EduLib</span>
            </div>
            
            <div className="flex items-center gap-8 text-sm font-semibold text-gray-500">
              <a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Contact Us</a>
            </div>

            <p className="text-sm text-gray-400">
              © 2024 EduLib. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
