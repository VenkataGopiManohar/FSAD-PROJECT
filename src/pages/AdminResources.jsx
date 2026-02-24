import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { useLibrary } from '../context/LibraryContext';
import { Library, Plus, Search, Edit2, Trash2, Star, Download } from 'lucide-react';
import { formatNumber, cn } from '../utils/helpers.jsx';

export default function AdminResources() {
  const { resources, deleteResource } = useLibrary();

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      <Sidebar role="admin" />
      <main className="flex-1 lg:ml-[260px] min-h-screen flex flex-col">
        <Navbar />
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Resource Management</h1>
              <p className="text-gray-500 mt-1">Add, edit, or remove library materials</p>
            </div>
            <button className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
              <Plus size={20} /> Add New Resource
            </button>
          </div>

          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search resources..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl outline-none transition-all text-sm"
                />
              </div>
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
                  {resources.map(resource => (
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
    </div>
  );
}
