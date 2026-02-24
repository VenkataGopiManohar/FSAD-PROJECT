import { createContext, useContext, useState, useEffect } from 'react';

const LibraryContext = createContext(null);

const MOCK_RESOURCES = [
  {
    id: '1',
    title: 'Introduction to Quantum Computing',
    description: 'A comprehensive guide to the fundamentals of quantum mechanics and its application in computing.',
    author: 'Dr. Sarah Chen',
    category: 'Science',
    subject: 'Physics',
    fileType: 'PDF',
    tags: ['Quantum', 'Computing', 'Physics'],
    downloadCount: 1240,
    rating: 4.8,
    featured: true,
    createdAt: '2023-10-15T10:00:00Z',
    reviews: [
      { id: 'r1', userId: 'u1', userName: 'John Doe', rating: 5, comment: 'Excellent resource!', date: '2023-11-01' }
    ]
  },
  {
    id: '2',
    title: 'Modern Web Architectures',
    description: 'Exploring microservices, serverless, and edge computing in the modern web era.',
    author: 'Alex Rivera',
    category: 'Technology',
    subject: 'Computer Science',
    fileType: 'Epub',
    tags: ['Web', 'Architecture', 'Backend'],
    downloadCount: 850,
    rating: 4.5,
    featured: true,
    createdAt: '2023-11-20T14:30:00Z',
    reviews: []
  },
  {
    id: '3',
    title: 'The Art of Renaissance',
    description: 'A visual journey through the most influential art period in human history.',
    author: 'Elena Moretti',
    category: 'Arts',
    subject: 'History',
    fileType: 'Video',
    tags: ['Art', 'History', 'Renaissance'],
    downloadCount: 420,
    rating: 4.9,
    featured: false,
    createdAt: '2023-12-05T09:15:00Z',
    reviews: []
  },
  {
    id: '4',
    title: 'Advanced Calculus Vol. 1',
    description: 'Deep dive into multivariate calculus and differential equations.',
    author: 'Prof. Michael Vogt',
    category: 'Mathematics',
    subject: 'Calculus',
    fileType: 'PDF',
    tags: ['Math', 'Calculus', 'Advanced'],
    downloadCount: 2100,
    rating: 4.7,
    featured: true,
    createdAt: '2023-09-10T08:00:00Z',
    reviews: []
  }
];

export const LibraryProvider = ({ children }) => {
  const [resources, setResources] = useState(() => {
    const saved = localStorage.getItem('edulib_resources');
    return saved ? JSON.parse(saved) : MOCK_RESOURCES;
  });

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('edulib_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('edulib_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('edulib_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('edulib_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('edulib_history', JSON.stringify(history));
  }, [history]);

  const addResource = (resource) => {
    const newResource = {
      ...resource,
      id: Math.random().toString(36).substr(2, 9),
      downloadCount: 0,
      rating: 0,
      reviews: [],
      createdAt: new Date().toISOString()
    };
    setResources(prev => [newResource, ...prev]);
  };

  const updateResource = (id, updatedData) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, ...updatedData } : r));
  };

  const deleteResource = (id) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const toggleBookmark = (id) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const addToHistory = (id) => {
    setHistory(prev => {
      const filtered = prev.filter(item => item.id !== id);
      return [{ id, timestamp: new Date().toISOString() }, ...filtered].slice(0, 50);
    });
    // Increment download count
    setResources(prev => prev.map(r => r.id === id ? { ...r, downloadCount: r.downloadCount + 1 } : r));
  };

  const addReview = (resourceId, review) => {
    setResources(prev => prev.map(r => {
      if (r.id === resourceId) {
        const newReviews = [...r.reviews, { ...review, id: Date.now().toString() }];
        const avgRating = newReviews.reduce((acc, curr) => acc + curr.rating, 0) / newReviews.length;
        return { ...r, reviews: newReviews, rating: parseFloat(avgRating.toFixed(1)) };
      }
      return r;
    }));
  };

  return (
    <LibraryContext.Provider value={{ 
      resources, 
      bookmarks, 
      history, 
      addResource, 
      updateResource, 
      deleteResource, 
      toggleBookmark, 
      addToHistory,
      addReview
    }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => useContext(LibraryContext);
