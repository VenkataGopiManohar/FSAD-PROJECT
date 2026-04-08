import { useState, useMemo } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { useDebounce } from '../hooks/useDebounce.jsx';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import ResourceCard from '../components/library/ResourceCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, List, Filter, ChevronRight } from 'lucide-react';
import { cn } from '../utils/helpers.jsx';

const CATEGORIES = ['All', 'Science', 'Technology', 'Mathematics', 'Arts', 'Literature', 'History'];

export default function UserDashboard() {
  const { resources } = useLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('recent');
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredResources = useMemo(() => {
    let result = resources.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                          r.author.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                          r.tags.some(t => t.toLowerCase().includes(debouncedSearch.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'recent') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.downloadCount - a.downloadCount);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [resources, debouncedSearch, selectedCategory, sortBy]);

  const featuredResources = resources.filter(r => r.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      <Sidebar role="user" />
      
      <main className="flex-1 lg:ml-[260px] min-h-screen flex flex-col">
        <Navbar onSearch={setSearchQuery} />

        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
          {/* Trending Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
              <button className="text-emerald-600 font-bold text-sm flex items-center gap-1 hover:underline">
                View all <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredResources.map((resource, idx) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </section>

          {/* Category Explorer */}
          <section>
            <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-6 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all border",
                    selectedCategory === cat
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20"
                      : "bg-white text-gray-500 border-gray-100 hover:border-emerald-200 hover:text-emerald-600"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Main Library Grid */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Explore Resources</h2>
                <p className="text-gray-500 text-sm mt-1">{filteredResources.length} materials found</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex p-1 bg-gray-100 rounded-xl">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400")}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400")}
                  >
                    <List size={18} />
                  </button>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-100 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 outline-none focus:border-emerald-500 transition-all"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              <motion.div 
                layout
                className={cn(
                  "grid gap-6",
                  viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                )}
              >
                {filteredResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} viewMode={viewMode} />
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredResources.length === 0 && (
              <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Filter className="text-gray-300" size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No resources found</h3>
                <p className="text-gray-500 max-w-xs mx-auto mt-2">Try adjusting your search or filters to find what you're looking for.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
