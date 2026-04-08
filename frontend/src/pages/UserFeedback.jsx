import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Star, Send } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../utils/helpers.jsx';

export default function UserFeedback() {
  const { resources } = useLibrary();
  const { user } = useAuth();
  
  // Get all reviews by this user
  const userReviews = resources.flatMap(r => 
    r.reviews.filter(rev => rev.userId === user?.id).map(rev => ({ ...rev, resourceTitle: r.title, resourceId: r.id }))
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      <Sidebar role="user" />
      <main className="flex-1 lg:ml-[260px] min-h-screen flex flex-col">
        <Navbar />
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
              <MessageSquare size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Feedback</h1>
              <p className="text-gray-500">Manage your reviews and ratings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {userReviews.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
                <p className="text-gray-500">You haven't left any feedback yet.</p>
              </div>
            ) : (
              userReviews.map(review => (
                <div key={review.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900">{review.resourceTitle}</h3>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mt-1">
                        Reviewed on {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={18} fill="currentColor" />
                      <span className="font-bold">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-50">
                    "{review.comment}"
                  </p>
                  <div className="mt-4 flex justify-end gap-3">
                    <button className="text-xs font-bold text-gray-400 hover:text-emerald-600 transition-colors">Edit Review</button>
                    <button className="text-xs font-bold text-gray-400 hover:text-red-600 transition-colors">Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
