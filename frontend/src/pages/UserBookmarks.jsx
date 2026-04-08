import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { useLibrary } from '../context/LibraryContext';
import ResourceCard from '../components/library/ResourceCard';
import { Bookmark, History } from 'lucide-react';

export default function UserBookmarks() {
  const { resources, bookmarks } = useLibrary();
  const bookmarkedResources = resources.filter(r => bookmarks.includes(r.id));

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      <Sidebar role="user" />
      <main className="flex-1 lg:ml-[260px] min-h-screen flex flex-col">
        <Navbar />
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
              <Bookmark size={24} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Bookmarks</h1>
              <p className="text-gray-500">Your curated collection of resources</p>
            </div>
          </div>

          {bookmarkedResources.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
              <p className="text-gray-500">You haven't bookmarked any resources yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedResources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
