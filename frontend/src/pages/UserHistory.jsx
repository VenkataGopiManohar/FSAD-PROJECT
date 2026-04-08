import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { useLibrary } from '../context/LibraryContext';
import ResourceCard from '../components/library/ResourceCard';
import { History } from 'lucide-react';

export default function UserHistory() {
  const { resources, history } = useLibrary();
  
  const historyResources = history.map(h => {
    const resource = resources.find(r => r.id === h.id);
    return { ...resource, downloadedAt: h.timestamp };
  }).filter(r => r.id);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      <Sidebar role="user" />
      <main className="flex-1 lg:ml-[260px] min-h-screen flex flex-col">
        <Navbar />
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
              <History size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Download History</h1>
              <p className="text-gray-500">Materials you've recently accessed</p>
            </div>
          </div>

          {historyResources.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
              <p className="text-gray-500">Your download history is empty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {historyResources.map(resource => (
                <div key={resource.id + resource.downloadedAt} className="relative">
                  <ResourceCard resource={resource} />
                  <div className="absolute bottom-4 left-6 right-6 pointer-events-none">
                    <span className="text-[10px] font-bold text-gray-400 uppercase bg-white/90 px-2 py-1 rounded-md">
                      Downloaded {new Date(resource.downloadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
