export const MOCK_RESOURCES = [
  {
    id: '1',
    title: 'Introduction to Quantum Computing',
    description: 'A comprehensive guide to the fundamentals of quantum bits, gates, and algorithms.',
    author: 'Dr. Sarah Chen',
    category: 'Science',
    subject: 'Physics',
    fileType: 'pdf',
    tags: ['Quantum', 'Computing', 'Physics'],
    isFeatured: true,
    downloadCount: 1250,
    viewCount: 5400,
    rating: 4.8,
    createdAt: '2024-01-15T10:00:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/quantum/400/300'
  },
  {
    id: '2',
    title: 'Modern Web Architecture',
    description: 'Exploring microservices, serverless, and edge computing in 2024.',
    author: 'Alex Rivera',
    category: 'Technology',
    subject: 'Computer Science',
    fileType: 'video',
    tags: ['Web', 'Architecture', 'Cloud'],
    isFeatured: true,
    downloadCount: 890,
    viewCount: 3200,
    rating: 4.6,
    createdAt: '2024-02-10T14:30:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/web/400/300'
  },
  {
    id: '3',
    title: 'Macroeconomics Principles',
    description: 'Understanding global markets, inflation, and fiscal policy.',
    author: 'Prof. James Wilson',
    category: 'Business',
    subject: 'Economics',
    fileType: 'pdf',
    tags: ['Economics', 'Finance', 'Global'],
    isFeatured: false,
    downloadCount: 450,
    viewCount: 1200,
    rating: 4.2,
    createdAt: '2023-11-20T09:15:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/econ/400/300'
  },
  {
    id: '4',
    title: 'Creative Writing Workshop',
    description: 'Mastering the art of storytelling and character development.',
    author: 'Elena Gilbert',
    category: 'Arts',
    subject: 'Literature',
    fileType: 'doc',
    tags: ['Writing', 'Creative', 'Literature'],
    isFeatured: false,
    downloadCount: 670,
    viewCount: 2100,
    rating: 4.9,
    createdAt: '2024-03-05T16:45:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/writing/400/300'
  },
  {
    id: '5',
    title: 'Data Visualization with D3.js',
    description: 'Learn how to build interactive data visualizations for the web.',
    author: 'Michael Scott',
    category: 'Technology',
    subject: 'Data Science',
    fileType: 'link',
    tags: ['D3', 'DataViz', 'JavaScript'],
    isFeatured: true,
    downloadCount: 2100,
    viewCount: 7800,
    rating: 4.7,
    createdAt: '2024-01-20T11:00:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/data/400/300'
  }
];

export const MOCK_USERS = [
  {
    id: 'admin-1',
    name: 'System Admin',
    email: 'admin@edulib.com',
    role: 'admin',
    status: 'active',
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'user-1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const CATEGORIES = [
  'All',
  'Science',
  'Technology',
  'Business',
  'Arts',
  'Mathematics',
  'History',
  'Languages'
];
