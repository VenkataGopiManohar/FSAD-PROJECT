import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Library, Users, Download, TrendingUp, Plus, Edit2, Trash2, MoreVertical, Star, X, Upload } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { formatNumber, cn } from '../utils/helpers.jsx';
import { useState } from 'react';

const DATA = [
  { name: 'Mon', downloads: 40 },
  { name: 'Tue', downloads: 30 },
  { name: 'Wed', downloads: 65 },
  { name: 'Thu', downloads: 45 },
  { name: 'Fri', downloads: 90 },
  { name: 'Sat', downloads: 55 },
  { name: 'Sun', downloads: 70 },
];

export default function AdminDashboard() {
  const { resources, deleteResource, addResource } = useLibrary();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    author: '',
    category: 'Science',
    subject: '',
    fileType: 'PDF',
    tags: ''
  });

  const stats = [
    { label: 'Total Resources', value: resources.length, icon: Library, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Downloads', value: resources.reduce((acc, r) => acc + r.downloadCount, 0), icon: Download, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Active Users', value: 1240, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Avg Rating', value: 4.7, icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const handleAddResource = (e) => {
    e.preventDefault();
    addResource({
      ...newResource,
      tags: newResource.tags.split(',').map(t => t.trim()),
      featured: false
    });
    setIsModalOpen(false);
    setNewResource({
      title: '',
      description: '',
      author: '',
      category: 'Science',
      subject: '',
      fileType: 'PDF',
      tags: ''
    });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      <Sidebar role="admin" />
      
      <main className="flex-1 lg:ml-[260px] min-h-screen flex flex-col">
        <Navbar />

        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Overview</h1>
              <p className="text-gray-500 mt-1">Manage your educational ecosystem</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
            >
              <Plus size={20} /> Add Resource
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm"
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", stat.bg, stat.color)}>
                  <stat.icon size={24} />
                </div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stat.value)}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Analytics Chart */}
            <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900">Download Trends</h3>
                <select className="bg-gray-50 border-none text-sm font-bold text-gray-500 rounded-xl px-4 py-2 outline-none">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 600 }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="downloads" 
                      stroke="#10B981" 
                      strokeWidth={4} 
                      dot={{ r: 6, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 8, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Categories */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-8">Top Categories</h3>
              <div className="space-y-6">
                {[
                  { name: 'Science', value: 45, color: 'bg-emerald-500' },
                  { name: 'Technology', value: 32, color: 'bg-indigo-500' },
                  { name: 'Mathematics', value: 28, color: 'bg-amber-500' },
                  { name: 'Arts', value: 15, color: 'bg-rose-500' },
                ].map(cat => (
                  <div key={cat.name} className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-gray-700">{cat.name}</span>
                      <span className="text-gray-400">{cat.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.value}%` }}
                        className={cn("h-full rounded-full", cat.color)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resource Management Table */}
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Recent Resources</h3>
              <button className="text-emerald-600 font-bold text-sm hover:underline">View all</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Resource</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Downloads</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rating</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {resources.slice(0, 5).map(resource => (
                    <tr key={resource.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Library size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{resource.title}</p>
                            <p className="text-xs text-gray-500">{resource.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                          {resource.category}
                        </span>
                      </td>
                      <td className="px-8 py-5 font-bold text-gray-700">{formatNumber(resource.downloadCount)}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star size={14} fill="currentColor" />
                          <span>{resource.rating}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => deleteResource(resource.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add Resource Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Add New Resource</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleAddResource} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Title</label>
                    <input
                      required
                      type="text"
                      value={newResource.title}
                      onChange={e => setNewResource({...newResource, title: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl outline-none transition-all"
                      placeholder="e.g. Quantum Physics 101"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Author</label>
                    <input
                      required
                      type="text"
                      value={newResource.author}
                      onChange={e => setNewResource({...newResource, author: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl outline-none transition-all"
                      placeholder="e.g. Dr. Jane Smith"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
                  <textarea
                    required
                    value={newResource.description}
                    onChange={e => setNewResource({...newResource, description: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl outline-none transition-all min-h-[100px]"
                    placeholder="Briefly describe the resource..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category</label>
                    <select
                      value={newResource.category}
                      onChange={e => setNewResource({...newResource, category: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl outline-none transition-all"
                    >
                      {['Science', 'Technology', 'Mathematics', 'Arts', 'Literature', 'History'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">File Type</label>
                    <select
                      value={newResource.fileType}
                      onChange={e => setNewResource({...newResource, fileType: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl outline-none transition-all"
                    >
                      {['PDF', 'Epub', 'Video', 'Audio', 'Image'].map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Subject</label>
                    <input
                      required
                      type="text"
                      value={newResource.subject}
                      onChange={e => setNewResource({...newResource, subject: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl outline-none transition-all"
                      placeholder="e.g. Physics"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newResource.tags}
                    onChange={e => setNewResource({...newResource, tags: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl outline-none transition-all"
                    placeholder="e.g. physics, quantum, science"
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-gray-50 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    <Upload size={20} /> Upload Resource
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
