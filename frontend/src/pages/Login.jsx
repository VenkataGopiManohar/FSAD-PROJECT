import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { generateCaptcha, cn } from '../utils/helpers.jsx';
import { motion } from 'framer-motion';
import { Mail, Lock, RefreshCw, ArrowRight, BookOpen } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (captchaInput.toUpperCase() !== captcha) {
      setError('Invalid CAPTCHA');
      setCaptcha(generateCaptcha());
      return;
    }

    try {
      login(email, password, role);
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50/50 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-teal-50/50 blur-[100px] rounded-full -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-emerald-100/50 p-10 border border-gray-100"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#10B981] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-600/20">
            <BookOpen className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-gray-500">Access your educational resource library</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex p-1.5 bg-gray-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole('user')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${role === 'user' ? 'bg-white text-[#10B981] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${role === 'admin' ? 'bg-white text-[#10B981] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Administrator
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#10B981] transition-colors" size={20} />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-[#10B981] rounded-2xl outline-none transition-all text-gray-900"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#10B981] transition-colors" size={20} />
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-[#10B981] rounded-2xl outline-none transition-all text-gray-900"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <span className="text-2xl font-mono font-bold tracking-[0.5em] text-[#10B981] select-none">
                {captcha}
              </span>
              <button 
                type="button"
                onClick={() => setCaptcha(generateCaptcha())}
                className="p-2 text-gray-400 hover:text-[#10B981] transition-colors"
              >
                <RefreshCw size={20} />
              </button>
            </div>
            <input
              type="text"
              required
              placeholder="Enter CAPTCHA"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              className="w-full px-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-[#10B981] rounded-2xl outline-none transition-all text-gray-900 text-center font-mono font-bold uppercase"
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-4 bg-[#10B981] hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 group"
          >
            Sign In
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500 text-sm">
          Don't have an account?{' '}
          <button onClick={() => navigate('/register')} className="text-[#10B981] font-bold hover:underline">
            Register now
          </button>
        </p>
      </motion.div>
    </div>
  );
}
