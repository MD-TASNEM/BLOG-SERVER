#!/usr/bin/env node

// Database setup script for Digital Life Lessons
const { connectDB } = require('../config/db');
const { MongoClient, ObjectId } = require('mongodb');

const setupDatabase = async () => {
  try {
    console.log('🚀 Starting database setup...');
    
    // Connect to database
    const db = await connectDB();
    console.log('✅ Connected to MongoDB');

    // Create collections with validation
    const collections = [
      {
        name: 'users',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['_id', 'name', 'email', 'role', 'isPremium'],
            properties: {
              _id: { bsonType: 'string' },
              name: { bsonType: 'string', minLength: 2, maxLength: 100 },
              email: { bsonType: 'string', pattern: '^[^\s@]+@[^\s@]+\.[^\s@]+$' },
              photoURL: { bsonType: 'string' },
              role: { enum: ['user', 'admin'] },
              isPremium: { bsonType: 'bool' },
              totalLessonsCreated: { bsonType: 'int', minimum: 0 },
              totalFavorites: { bsonType: 'int', minimum: 0 },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' }
            }
          }
        }
      },
      {
        name: 'lessons',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['_id', 'creatorId', 'title', 'description', 'category', 'visibility', 'accessLevel'],
            properties: {
              _id: { bsonType: 'string' },
              creatorId: { bsonType: 'string' },
              title: { bsonType: 'string', minLength: 3, maxLength: 200 },
              description: { bsonType: 'string', minLength: 10, maxLength: 5000 },
              category: { enum: ['Personal Growth', 'Career', 'Relationships', 'Mindset', 'Mistakes Learned', 'Health', 'Finance', 'Spirituality', 'Other'] },
              emotionalTone: { enum: ['Motivational', 'Sad', 'Realization', 'Gratitude', 'Warning', 'Hopeful', 'Reflective', 'Inspirational', 'Other'] },
              image: { bsonType: 'string' },
              visibility: { enum: ['public', 'private'] },
              accessLevel: { enum: ['free', 'premium'] },
              likes: { bsonType: 'array', items: { bsonType: 'string' } },
              likesCount: { bsonType: 'int', minimum: 0 },
              comments: { bsonType: 'array' },
              commentsCount: { bsonType: 'int', minimum: 0 },
              favoritesCount: { bsonType: 'int', minimum: 0 },
              views: { bsonType: 'int', minimum: 0 },
              featured: { bsonType: 'bool' },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' }
            }
          }
        }
      },
      {
        name: 'favorites',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['_id', 'userId', 'lessonId'],
            properties: {
              _id: { bsonType: 'string' },
              userId: { bsonType: 'string' },
              lessonId: { bsonType: 'string' },
              createdAt: { bsonType: 'date' }
            }
          }
        }
      },
      {
        name: 'reports',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['_id', 'lessonId', 'reporterUserId', 'reason'],
            properties: {
              _id: { bsonType: 'string' },
              lessonId: { bsonType: 'string' },
              reporterUserId: { bsonType: 'string' },
              reporterEmail: { bsonType: 'string' },
              reason: { enum: ['Inappropriate Content', 'Hate Speech or Harassment', 'Misleading or False Information', 'Spam or Promotional Content', 'Sensitive or Disturbing Content', 'Other'] },
              description: { bsonType: 'string', maxLength: 1000 },
              status: { enum: ['pending', 'resolved'] },
              createdAt: { bsonType: 'date' }
            }
          }
        }
      },
      {
        name: 'payments',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['_id', 'userId', 'stripeSessionId', 'amount', 'status'],
            properties: {
              _id: { bsonType: 'string' },
              userId: { bsonType: 'string' },
              stripeSessionId: { bsonType: 'string' },
              stripeCustomerId: { bsonType: 'string' },
              amount: { bsonType: 'int', minimum: 0 },
              currency: { bsonType: 'string', pattern: '^[A-Z]{3}$' },
              status: { enum: ['pending', 'completed', 'failed', 'cancelled'] },
              planType: { bsonType: 'string' },
              createdAt: { bsonType: 'date' },
              completedAt: { bsonType: 'date' }
            }
          }
        }
      }
    ];

    // Create collections with validation
    for (const collection of collections) {
      try {
        await db.createCollection(collection.name, {
          validator: collection.validator
        });
        console.log(`✅ Created collection: ${collection.name}`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`ℹ️  Collection ${collection.name} already exists`);
        } else {
          console.error(`❌ Error creating collection ${collection.name}:`, error.message);
        }
      }
    }

    // Create indexes for better performance
    const indexes = [
      { collection: 'users', index: { email: 1 }, options: { unique: true } },
      { collection: 'lessons', index: { creatorId: 1 } },
      { collection: 'lessons', index: { visibility: 1, accessLevel: 1 } },
      { collection: 'lessons', index: { category: 1 } },
      { collection: 'lessons', index: { emotionalTone: 1 } },
      { collection: 'lessons', index: { createdAt: -1 } },
      { collection: 'lessons', index: { likesCount: -1 } },
      { collection: 'lessons', index: { favoritesCount: -1 } },
      { collection: 'lessons', index: { views: -1 } },
      { collection: 'lessons', index: { featured: 1, createdAt: -1 } },
      { collection: 'lessons', index: { title: 'text', description: 'text', creatorName: 'text' }, options: { name: 'search_index' } },
      { collection: 'favorites', index: { userId: 1, lessonId: 1 }, options: { unique: true } },
      { collection: 'reports', index: { lessonId: 1 } },
      { collection: 'reports', index: { reporterUserId: 1 } },
      { collection: 'reports', index: { status: 1, createdAt: -1 } },
      { collection: 'payments', index: { userId: 1 } },
      { collection: 'payments', index: { stripeSessionId: 1 }, options: { unique: true } },
      { collection: 'payments', index: { status: 1 } }
    ];

    for (const { collection, index, options } of indexes) {
      try {
        await db.collection(collection).createIndex(index, options || {});
        console.log(`✅ Created index on ${collection}`);
      } catch (error) {
        console.error(`❌ Error creating index on ${collection}:`, error.message);
      }
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('\n📊 Collections created:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    console.log('\n🔍 Indexes created for optimal performance');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
};

// Run setup if called directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('\n✨ Setup complete! You can now start the server.');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupDatabase };
