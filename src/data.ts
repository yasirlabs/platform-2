import { Course, Trainer, BlogPost, User } from './types';

export const COURSES: Course[] = [
  {
    id: '1',
    title: 'Graphic Design Mastery',
    trainer: 'Alex Rivera',
    trainerId: 't1',
    description: 'Master the art of visual communication. Learn Adobe Photoshop, Illustrator, and Figma from scratch.',
    duration: '12 Weeks',
    lessonsCount: 48,
    level: 'Beginner',
    price: 49.99,
    studentsCount: 1250,
    rating: 4.8,
    category: 'Design',
    image: 'https://res.cloudinary.com/dvx6nsrd9/image/upload/v1773343211/placeholder_ova3fx.png',
    curriculum: [
      { id: 'l1', title: 'Introduction to Design Principles', duration: '45m', videoUrl: '', description: 'Understanding balance, contrast, and hierarchy.' },
      { id: 'l2', title: 'Color Theory & Typography', duration: '60m', videoUrl: '', description: 'How to choose fonts and colors that work.' },
      { id: 'l3', title: 'Mastering Adobe Illustrator', duration: '120m', videoUrl: '', description: 'Vector graphics and path manipulation.' },
    ]
  },
  {
    id: '2',
    title: 'Full-Stack Web Development',
    trainer: 'Sarah Chen',
    trainerId: 't2',
    description: 'Build modern web applications using React, Node.js, and MongoDB. From frontend to backend.',
    duration: '16 Weeks',
    lessonsCount: 72,
    level: 'Intermediate',
    price: 89.99,
    studentsCount: 3400,
    rating: 4.9,
    category: 'Programming',
    image: 'https://res.cloudinary.com/dvx6nsrd9/image/upload/v1773343211/placeholder_ova3fx.png',
    curriculum: [
      { id: 'l4', title: 'React Hooks Deep Dive', duration: '90m', videoUrl: '' },
      { id: 'l5', title: 'Express.js Middleware', duration: '75m', videoUrl: '' },
    ]
  },
  {
    id: '3',
    title: 'Python for Data Science',
    trainer: 'David Miller',
    trainerId: 't3',
    description: 'Learn Python libraries like Pandas, NumPy, and Scikit-Learn for data analysis and machine learning.',
    duration: '10 Weeks',
    lessonsCount: 36,
    level: 'Advanced',
    price: 59.99,
    studentsCount: 2100,
    rating: 4.7,
    category: 'Data Science',
    image: 'https://res.cloudinary.com/dvx6nsrd9/image/upload/v1773343211/placeholder_ova3fx.png',
    curriculum: [
      { id: 'l6', title: 'NumPy Arrays & Vectorization', duration: '50m', videoUrl: '' },
    ]
  }
];

export const TRAINERS: Trainer[] = [
  { id: 't1', name: 'Alex Rivera', specialty: 'Graphic Design', coursesCount: 5, avatar: 'https://res.cloudinary.com/dvx6nsrd9/image/upload/v1773343211/placeholder_ova3fx.png' },
  { id: 't2', name: 'Sarah Chen', specialty: 'Web Development', coursesCount: 8, avatar: 'https://res.cloudinary.com/dvx6nsrd9/image/upload/v1773343211/placeholder_ova3fx.png' },
  { id: 't3', name: 'David Miller', specialty: 'Data Science', coursesCount: 4, avatar: 'https://res.cloudinary.com/dvx6nsrd9/image/upload/v1773343211/placeholder_ova3fx.png' },
];

export const BLOG_POSTS: BlogPost[] = [
  { id: 'b1', title: 'The Future of AI in Design', excerpt: 'How generative AI is changing the landscape for creative professionals.', date: 'May 15, 2024', author: 'Alex Rivera', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800' },
  { id: 'b2', title: 'Top 10 React Libraries in 2024', excerpt: 'A comprehensive list of the most useful libraries for your next project.', date: 'June 2, 2024', author: 'Sarah Chen', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800' },
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://i.pravatar.cc/150?u=8',
  joinDate: 'Jan 10, 2024',
  role: 'user',
  enrolledCourses: [
    { courseId: '1', completedLessons: ['l1'], enrolledAt: '2024-01-15' },
    { courseId: '2', completedLessons: [], enrolledAt: '2024-02-20' }
  ],
  certificates: [
    { id: 'c1', courseId: '3', courseName: 'Python for Data Science', issueDate: '2024-03-01' }
  ]
};
