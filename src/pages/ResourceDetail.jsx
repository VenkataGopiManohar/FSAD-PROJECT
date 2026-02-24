import { useParams, useNavigate } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { motion } from 'framer-motion';
import { Star, Download, Bookmark, User, Calendar, Tag, FileText, ArrowLeft, Send } from 'lucide-react';
import { useState } from 'react';
import { cn, formatNumber } from '../utils/helpers.jsx';

export default function ResourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { resources, bookmarks, toggleBookmark, addToHistory, addReview } = useLibrary();
  const { user } = useAuth();
  
  const resource = resources.find(r => r.id === id);
  const isBookmarked = bookmarks.includes(id);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  if (!resource) return <div>Resource not found</div>;

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      addToHistory(id);
      setIsDownloading(false);
      alert('Download started! (Simulation)');
    }, 1500);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    addReview(id, {
      userId: user.id,
      userName: user.email.split('@')[0],
      rating,
      comment,
      date: new Date().toISOString()
    });
    setComment('');
    setRating(5);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      <Sidebar role={user?.role || 'user'} />
      
      <main className="flex-1 lg:ml-[260px] min-h-screen flex flex-col">
        <Navbar />

        <div className="p-6 lg:p-10 max-w-5xl mx-auto w-full space-y-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-bold transition-colors"
          >
            <ArrowLeft size={20} /> Back to Library
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full uppercase tracking-wider">
                    {resource.category}
                  </span>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">
                    {resource.fileType}
                  </span>
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">{resource.title}</h1>
                
                <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                      {resource.author[0]}
                    </div>
                    <span className="font-semibold text-gray-900">{resource.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>Published {new Date(resource.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={18} className="text-amber-500" fill="currentColor" />
                    <span className="font-bold text-gray-900">{resource.rating}</span>
                    <span>({resource.reviews.length} reviews)</span>
                  </div>
                </div>

                <div className="prose prose-emerald max-w-none">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {resource.description}
                  </p>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map(tag => (
                      <span key={tag} className="px-4 py-2 bg-gray-50 text-gray-600 text-sm font-medium rounded-xl border border-gray-100">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feedback Section */}
              <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-8">Community Feedback</h3>
                
                <form onSubmit={handleReviewSubmit} className="mb-10 space-y-4">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm font-bold text-gray-700">Your Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          className={cn(
                            "p-1 transition-colors",
                            s <= rating ? "text-amber-500" : "text-gray-200"
                          )}
                        >
                          <Star size={24} fill="currentColor" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts about this resource..."
                      className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl outline-none transition-all text-gray-900 min-h-[120px]"
                    />
                    <button
                      type="submit"
                      className="absolute bottom-4 right-4 p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </form>

                <div className="space-y-6">
                  {resource.reviews.length === 0 ? (
                    <p className="text-center text-gray-400 py-6">No reviews yet. Be the first to share your feedback!</p>
                  ) : (
                    resource.reviews.map(review => (
                      <div key={review.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                              {review.userName[0].toUpperCase()}
                            </div>
                            <span className="font-bold text-gray-900">{review.userName}</span>
                          </div>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star size={14} fill="currentColor" />
                            <span className="text-sm font-bold">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                        <span className="text-[10px] text-gray-400 mt-3 block uppercase font-bold tracking-wider">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Actions */}
            <div className="space-y-6">
              <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm sticky top-28">
                <div className="flex items-center justify-between mb-8">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Downloads</p>
                    <p className="text-xl font-bold text-gray-900">{formatNumber(resource.downloadCount)}</p>
                  </div>
                  <div className="w-[1px] h-8 bg-gray-100" />
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Rating</p>
                    <p className="text-xl font-bold text-gray-900">{resource.rating}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className={cn(
                      "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg",
                      isDownloading 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                        : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20"
                    )}
                  >
                    {isDownloading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Download size={20} />
                      </motion.div>
                    ) : (
                      <Download size={20} />
                    )}
                    {isDownloading ? 'Downloading...' : 'Download Resource'}
                  </button>

                  <button
                    onClick={() => toggleBookmark(id)}
                    className={cn(
                      "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all border",
                      isBookmarked
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-white text-gray-600 border-gray-100 hover:border-emerald-200 hover:text-emerald-600"
                    )}
                  >
                    <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
                    {isBookmarked ? 'Bookmarked' : 'Save to Library'}
                  </button>
                </div>

                <div className="mt-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <div className="flex items-center gap-3 mb-3 text-indigo-700">
                    <FileText size={20} />
                    <span className="font-bold">Preview Available</span>
                  </div>
                  <p className="text-xs text-indigo-600/80 leading-relaxed">
                    This resource includes a full preview. You can view the first 5 pages before downloading.
                  </p>
                  <button className="mt-4 w-full py-2 bg-white text-indigo-600 text-sm font-bold rounded-xl border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all">
                    Open Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
