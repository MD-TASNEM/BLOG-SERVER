const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

// Sample professional dummy data
const dummyUsers = [
  {
    uid: "user001",
    email: "sarah.johnson@example.com",
    name: "Sarah Johnson",
    photoURL: "https://images.unsplash.com/photo-1494790108755-2616b612b5e6?w=100&h=100&fit=crop&crop=face",
    role: "user",
    isPremium: true,
    createdAt: new Date('2024-01-15'),
    bio: "Life coach and motivational speaker with 10+ years of experience"
  },
  {
    uid: "user002", 
    email: "michael.chen@example.com",
    name: "Michael Chen",
    photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    role: "user",
    isPremium: false,
    createdAt: new Date('2024-02-20'),
    bio: "Tech entrepreneur and startup mentor"
  },
  {
    uid: "user003",
    email: "emily.rodriguez@example.com", 
    name: "Emily Rodriguez",
    photoURL: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    role: "user",
    isPremium: true,
    createdAt: new Date('2024-03-10'),
    bio: "Psychologist specializing in personal growth and relationships"
  },
  {
    uid: "user004",
    email: "david.kim@example.com",
    name: "David Kim", 
    photoURL: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    role: "admin",
    isPremium: true,
    createdAt: new Date('2024-01-05'),
    bio: "Platform administrator and community manager"
  },
  {
    uid: "user005",
    email: "lisa.anderson@example.com",
    name: "Lisa Anderson",
    photoURL: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face", 
    role: "user",
    isPremium: false,
    createdAt: new Date('2024-04-01'),
    bio: "Corporate trainer and leadership development coach"
  }
];

const dummyLessons = [
  {
    creatorId: "user001",
    creatorName: "Sarah Johnson",
    creatorPhoto: "https://images.unsplash.com/photo-1494790108755-2616b612b5e6?w=100&h=100&fit=crop&crop=face",
    title: "The Power of Vulnerability in Leadership",
    description: "Discover how embracing vulnerability can transform your leadership style and create stronger, more authentic connections with your team. This lesson shares personal experiences of overcoming the fear of showing weakness and how it led to breakthrough moments in my career.",
    category: "Career",
    emotionalTone: "Realization",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
    visibility: "public",
    accessLevel: "premium",
    likes: ["user002", "user003", "user005"],
    likesCount: 3,
    comments: [
      {
        userId: "user002",
        userName: "Michael Chen", 
        userPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        text: "This really resonated with me. I've always struggled with showing vulnerability at work.",
        createdAt: new Date('2024-03-15')
      },
      {
        userId: "user003",
        userName: "Emily Rodriguez",
        userPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", 
        text: "Beautifully written! Vulnerability is indeed strength in disguise.",
        createdAt: new Date('2024-03-16')
      }
    ],
    commentsCount: 2,
    favorites: ["user002", "user003"],
    favoritesCount: 2,
    views: 245,
    featured: true,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-03-01')
  },
  {
    creatorId: "user002",
    creatorName: "Michael Chen",
    creatorPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    title: "Failing Forward: My Startup Journey",
    description: "Three failed startups taught me more about success than any business book. Learn from my mistakes in product development, team building, and market validation. This honest account covers the emotional toll of failure and the resilience required to try again.",
    category: "Mistakes Learned",
    emotionalTone: "Realization", 
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    visibility: "public",
    accessLevel: "free",
    likes: ["user001", "user003", "user004", "user005"],
    likesCount: 4,
    comments: [
      {
        userId: "user001",
        userName: "Sarah Johnson",
        userPhoto: "https://images.unsplash.com/photo-1494790108755-2616b612b5e6?w=100&h=100&fit=crop&crop=face",
        text: "Thank you for sharing this so honestly. It's inspiring to see failure reframed as learning.",
        createdAt: new Date('2024-03-20')
      }
    ],
    commentsCount: 1,
    favorites: ["user001", "user004"],
    favoritesCount: 2,
    views: 189,
    featured: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-05')
  },
  {
    creatorId: "user003",
    creatorName: "Emily Rodriguez",
    creatorPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    title: "Setting Boundaries Saved My Mental Health",
    description: "As a people-pleaser, I learned the hard way that saying 'no' isn't selfish—it's necessary. This lesson explores my journey from burnout to balanced living through healthy boundary setting in both personal and professional relationships.",
    category: "Personal Growth",
    emotionalTone: "Gratitude",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    visibility: "public", 
    accessLevel: "premium",
    likes: ["user001", "user002", "user004", "user005"],
    likesCount: 4,
    comments: [
      {
        userId: "user005",
        userName: "Lisa Anderson",
        userPhoto: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
        text: "This is exactly what I needed to hear today. Thank you for your vulnerability.",
        createdAt: new Date('2024-03-25')
      }
    ],
    commentsCount: 1,
    favorites: ["user001", "user005"],
    favoritesCount: 2,
    views: 312,
    featured: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-03-10')
  },
  {
    creatorId: "user005",
    creatorName: "Lisa Anderson",
    creatorPhoto: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
    title: "The Art of Difficult Conversations",
    description: "After years of avoiding conflict, I discovered a framework for having productive difficult conversations. This lesson shares practical techniques for addressing sensitive topics while preserving relationships and achieving positive outcomes.",
    category: "Relationships",
    emotionalTone: "Motivational",
    image: "https://images.unsplash.com/photo-1515378791036-064f58007c45?w=600&h=400&fit=crop",
    visibility: "public",
    accessLevel: "free",
    likes: ["user001", "user002", "user003"],
    likesCount: 3,
    comments: [],
    commentsCount: 0,
    favorites: ["user003", "user004"],
    favoritesCount: 2,
    views: 156,
    featured: false,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-15')
  },
  {
    creatorId: "user001",
    creatorName: "Sarah Johnson", 
    creatorPhoto: "https://images.unsplash.com/photo-1494790108755-2616b612b5e6?w=100&h=100&fit=crop&crop=face",
    title: "Mindfulness Changed My Relationship with Anxiety",
    description: "Living with anxiety for years felt like a constant battle. This lesson shares how mindfulness practices transformed my relationship with anxiety from fighting to accepting, and ultimately finding peace in the present moment.",
    category: "Mindset",
    emotionalTone: "Gratitude",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    visibility: "public",
    accessLevel: "premium",
    likes: ["user002", "user003", "user004", "user005"],
    likesCount: 4,
    comments: [
      {
        userId: "user004",
        userName: "David Kim",
        userPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        text: "This approach has been game-changing for me too. Thank you for sharing!",
        createdAt: new Date('2024-03-28')
      }
    ],
    commentsCount: 1,
    favorites: ["user002", "user004"],
    favoritesCount: 2,
    views: 278,
    featured: true,
    createdAt: new Date('2024-02-25'),
    updatedAt: new Date('2024-03-20')
  },
  {
    creatorId: "user003",
    creatorName: "Emily Rodriguez",
    creatorPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    title: "The Gift of Imperfection",
    description: "Perfectionism kept me stuck for years. Learning to embrace imperfection opened up creativity, joy, and authentic connections. This lesson explores the journey from striving for flawless to celebrating perfectly imperfect progress.",
    category: "Personal Growth",
    emotionalTone: "Realization",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop",
    visibility: "public",
    accessLevel: "free",
    likes: ["user001", "user002", "user005"],
    likesCount: 3,
    comments: [],
    commentsCount: 0,
    favorites: ["user001"],
    favoritesCount: 1,
    views: 134,
    featured: false,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-25')
  }
];

const dummyFavorites = [
  { userId: "user001", lessonId: "lesson002", createdAt: new Date('2024-03-01') },
  { userId: "user001", lessonId: "lesson006", createdAt: new Date('2024-03-15') },
  { userId: "user002", lessonId: "lesson001", createdAt: new Date('2024-02-20') },
  { userId: "user002", lessonId: "lesson005", createdAt: new Date('2024-03-10') },
  { userId: "user003", lessonId: "lesson001", createdAt: new Date('2024-02-25') },
  { userId: "user003", lessonId: "lesson004", createdAt: new Date('2024-03-05') },
  { userId: "user004", lessonId: "lesson002", createdAt: new Date('2024-02-18') },
  { userId: "user004", lessonId: "lesson005", createdAt: new Date('2024-03-12') },
  { userId: "user005", lessonId: "lesson003", createdAt: new Date('2024-03-08') },
  { userId: "user005", lessonId: "lesson006", createdAt: new Date('2024-03-22') }
];

// MongoDB connection function
async function seedDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/digital-lessons');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Clear existing data
    await db.collection('users').deleteMany({});
    await db.collection('lessons').deleteMany({});
    await db.collection('favorites').deleteMany({});
    
    console.log('Cleared existing data');
    
    // Insert dummy data
    await db.collection('users').insertMany(dummyUsers);
    await db.collection('lessons').insertMany(dummyLessons);
    await db.collection('favorites').insertMany(dummyFavorites);
    
    console.log('✅ Dummy data inserted successfully!');
    console.log(`📊 Inserted ${dummyUsers.length} users`);
    console.log(`📚 Inserted ${dummyLessons.length} lessons`);
    console.log(`❤️ Inserted ${dummyFavorites.length} favorites`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, dummyUsers, dummyLessons, dummyFavorites };
