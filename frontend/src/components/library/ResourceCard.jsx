import { motion } from 'framer-motion';
import { Star, Download, Bookmark, FileText, User, Tag } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { cn, formatNumber } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

export default function ResourceCard({ resource, viewMode = 'grid' }) {
  const { toggleBookmark, bookmarks } = useLibrary();
  const navigate = useNavigate();
  const isBookmarked = bookmarks.includes(resource.id);

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="group bg-white border border-gray-100 p-4 rounded-2xl hover:shadow-lg hover:border-emerald-100 transition-all flex items-center gap-6 cursor-pointer"
        onClick={() => navigate(`/resource/${resource.id}`)}
      >
        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
          <FileText size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 truncate group-hover:text-emerald-600 transition-colors">{resource.title}</h3>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
            <span className="flex items-center gap-1"><User size={14} /> {resource.author}</span>
            <span className="px-2 py-0.5 bg-gray-100 rounded-md text-xs font-medium">{resource.category}</span>
          </div>
        </div>
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Star size={16} fill="currentColor" />
            <span>{resource.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <Download size={16} />
            <span>{formatNumber(resource.downloadCount)}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(resource.id);
            }}
            className={cn(
              "p-2 rounded-xl transition-colors",
              isBookmarked ? "text-emerald-600 bg-emerald-50" : "text-gray-400 hover:bg-gray-100"
            )}
          >
            <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-100 transition-all cursor-pointer flex flex-col h-full"
      onClick={() => navigate(`/resource/${resource.id}`)}
    >
      <div className="relative aspect-[4/3] bg-gray-50 p-6 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <FileText size={64} className="text-emerald-200 group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-500" />
        
        <div className="absolute top-4 left-4 flex gap-2">
          {resource.featured && (
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-amber-200">
              Featured
            </span>
          )}
          <span className="px-3 py-1 bg-white/80 backdrop-blur-md text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-full border border-gray-100">
            {resource.fileType}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark(resource.id);
          }}
          className={cn(
            "absolute top-4 right-4 p-2.5 rounded-2xl backdrop-blur-md transition-all",
            isBookmarked 
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
              : "bg-white/80 text-gray-400 hover:text-emerald-500 hover:bg-white"
          )}
        >
          <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">{resource.category}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">{resource.subject}</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {resource.title}
        </h3>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-1">
          {resource.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-xs font-bold">
              {resource.author[0]}
            </div>
            <span className="text-xs font-semibold text-gray-700">{resource.author}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
              <Star size={14} fill="currentColor" />
              <span>{resource.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Download size={14} />
              <span>{formatNumber(resource.downloadCount)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
