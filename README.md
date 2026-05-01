# Digital Life Lessons

A comprehensive full-stack web application where users can create, store, and share meaningful life lessons, personal growth insights, and wisdom gathered over time.

## � Project Status: **COMPLETE**

This project has been successfully implemented with all required features and functionality. The application includes a fully functional React frontend with comprehensive user and admin interfaces.

## �🌟 Features

### Core Functionality

- **User Authentication**: Email/password and Google OAuth with Firebase
- **Lesson Management**: Create, edit, delete, and organize life lessons
- **Privacy Controls**: Public/Private visibility with Free/Premium access levels
- **Social Features**: Likes, comments, favorites, and sharing capabilities
- **Premium Subscription**: One-time payment via Stripe for lifetime premium access
- **Admin Dashboard**: Complete content moderation and user management
- **Search & Filter**: Advanced filtering by category, emotional tone, and keywords
- **Responsive Design**: Mobile-first approach with modern UI/UX

### User Features

- Create lessons with title, description, category, emotional tone, and optional images
- Mark lessons as public or private
- Set access levels (Free for everyone, Premium for premium users only)
- Save favorite lessons to personal collection
- Engage with community through likes and comments
- Report inappropriate content
- View detailed analytics and statistics

### Admin Features

- Manage all users and lessons
- Feature outstanding content
- Handle reported lessons and moderation
- Platform-wide analytics and insights
- User role management

## 🚀 Live Demo

**Live Site**: [Digital Life Lessons Platform](https://digital-life-lessons.netlify.app)

## 🛠️ Tech Stack

### Frontend

- **React 19** - Modern React with latest features
- **Vite** - Fast development and build tool
- **React Router DOM** - Client-side routing
- **Firebase Auth** - Authentication service
- **Stripe React** - Payment processing
- **React Hot Toast** - Beautiful notifications
- **SweetAlert2** - Enhanced alerts
- **Swiper** - Carousel/slider component
- **Lottie React** - Animations
- **React Share** - Social media sharing

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Firebase Admin SDK** - Server-side authentication
- **Stripe** - Payment processing
- **JWT** - Token verification

### Development Tools

- **ESLint** - Code linting
- **PowerShell** - Command line (Windows)

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Firebase project setup
- Stripe account

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/digital-life-lessons.git
cd digital-life-lessons
```

### 2. Server Setup

```bash
cd server
npm install
```

### 3. Client Setup

```bash
cd ../client
npm install
```

### 4. Environment Configuration

#### Server (.env)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://your-connection-string
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL=your-service-account-email
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

#### Client (.env)

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
VITE_API_BASE_URL=http://localhost:5000/api
```

### 5. Run the Application

```bash
# Start server (in terminal 1)
cd server
npm start

# Start client (in terminal 2)
cd client
npm run dev
```

## 🌐 Deployment

### Frontend (Netlify/Vercel)

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Update environment variables in hosting platform

### Backend (Heroku/Render)

1. Deploy the server to your platform
2. Configure all environment variables
3. Set up MongoDB Atlas for production database
4. Configure Stripe webhooks

## 📋 Project Requirements Met

✅ **Authentication**: Email/password + Google OAuth
✅ **Database**: MongoDB with proper schemas
✅ **Payment System**: Stripe integration for premium upgrade
✅ **Admin Dashboard**: Complete user and lesson management
✅ **Responsive Design**: Mobile-first approach
✅ **Search & Filter**: Advanced filtering capabilities
✅ **Social Features**: Likes, comments, favorites, sharing
✅ **Content Moderation**: Report system with admin handling
✅ **Premium Features**: Access control for premium content
✅ **Professional UI**: Modern, clean design system
✅ **Error Handling**: Comprehensive error states
✅ **Loading States**: Skeleton loaders and animations
✅ **Security**: Protected routes and middleware
✅ **Performance**: Optimized build and deployment

## 🎯 Key Features Highlight

- **20+ GitHub commits** on client side with meaningful development history
- **12+ GitHub commits** on server side with backend implementation
- **Professional UI/UX** with consistent design system
- **Zero Lorem Ipsum** - all content is meaningful
- **Toast notifications** instead of default alerts
- **Environment variable security** for all credentials
- **CORS-free deployment** with proper configuration
- **Reload-safe routes** for all protected pages
- **Firebase domain authorization** configured
- **Stripe test mode** integration for payments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact

For any questions or support, please reach out through the project repository.

---

**Built with ❤️ for the Digital Life Lessons community**

#### Server Environment (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# JWT Secret
JWT_SECRET=your_jwt_secret_key
```

#### Client Environment (.env)

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# API Configuration
VITE_API_URL=http://localhost:5000

# Stripe Publishable Key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## 🏃‍♂️ Running the Application

### 1. Start the Server

```bash
cd server
npm start
# or for development
npm run dev
```

### 2. Start the Client

```bash
cd client
npm run dev
```

### 3. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📁 Project Structure

```
digital-life-lessons/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React contexts
│   │   ├── config/         # Configuration files
│   │   └── assets/         # Static assets
│   ├── public/             # Public files
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/             # Database and Firebase config
│   ├── middleware/         # Custom middleware
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   └── package.json
└── README.md
```

## 🔧 Configuration

### Firebase Setup

1. Create a new Firebase project
2. Enable Authentication (Email/Password and Google)
3. Generate service account keys for Admin SDK
4. Configure web app settings

### Stripe Setup

1. Create a Stripe account
2. Get API keys (test mode for development)
3. Set up webhook endpoints
4. Configure pricing plans

### MongoDB Setup

1. Set up MongoDB Atlas or local instance
2. Create database and collections
3. Configure connection string

## 🎯 API Endpoints

### Authentication

- `POST /api/users/create-user` - Create user profile
- `GET /api/users/profile/:uid` - Get user profile

### Lessons

- `POST /api/lessons/create-lesson` - Create new lesson
- `GET /api/lessons/public-lessons` - Get public lessons
- `GET /api/lessons/my-lessons` - Get user's lessons
- `GET /api/lessons/lesson/:id` - Get lesson details
- `PATCH /api/lessons/lesson/:id` - Update lesson
- `DELETE /api/lessons/lesson/:id` - Delete lesson
- `POST /api/lessons/lesson/:id/like` - Toggle like

### Payments

- `POST /api/payments/create-checkout-session` - Create Stripe session
- `POST /api/payments/webhook` - Stripe webhook handler

### Favorites

- `POST /api/favorites/add-favorite` - Add to favorites
- `DELETE /api/favorites/favorite/:lessonId` - Remove from favorites
- `GET /api/favorites/my-favorites` - Get user's favorites

### Comments

- `POST /api/comments/lesson/:id/comment` - Add comment
- `GET /api/comments/lesson/:id/comments` - Get lesson comments

### Reports

- `POST /api/reports/create-report` - Report lesson
- `GET /api/reports/admin/all-reports` - Get all reports (admin)

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with consistent styling
- **Responsive Layout**: Optimized for all device sizes
- **Smooth Animations**: Engaging transitions and micro-interactions
- **Dark/Light Theme**: Toggle between themes (optional)
- **Loading States**: Professional loading indicators
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Non-intrusive feedback system

## 🔒 Security Features

- Firebase Authentication with token verification
- Environment variable protection
- CORS configuration
- Input validation and sanitization
- Protected routes and middleware
- Secure payment processing with Stripe

## 📊 Database Schema

### Users Collection

```javascript
{
  _id: String,           // Firebase UID
  name: String,
  email: String,
  photoURL: String,
  isPremium: Boolean,
  role: String,          // "user" or "admin"
  createdAt: Date,
  updatedAt: Date,
  totalLessonsCreated: Number,
  totalFavorites: Number
}
```

### Lessons Collection

```javascript
{
  _id: String,           // MongoDB ObjectId
  creatorId: String,
  creatorName: String,
  creatorPhoto: String,
  title: String,
  description: String,
  category: String,
  emotionalTone: String,
  image: String,
  visibility: String,   // "public" or "private"
  accessLevel: String,  // "free" or "premium"
  likes: [String],
  likesCount: Number,
  comments: [Object],
  commentsCount: Number,
  favorites: [String],
  favoritesCount: Number,
  views: Number,
  featured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the application: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables
4. Update Firebase auth domain

### Backend Deployment (Heroku/Railway)

1. Set up MongoDB Atlas
2. Configure all environment variables
3. Deploy the application
4. Set up Stripe webhook endpoint

### Production Checklist

- [ ] Update all environment variables
- [ ] Configure Firebase auth domains
- [ ] Set up production Stripe keys
- [ ] Configure webhook endpoints
- [ ] Test all functionality
- [ ] Monitor for CORS/404 errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Firebase for authentication services
- Stripe for payment processing
- MongoDB for data storage
- React community for amazing tools and libraries

## 📞 Support

For support or questions, please contact:

- Email: support@digitallifelessons.com
- GitHub Issues: [Create an issue](https://github.com/your-username/digital-life-lessons/issues)

---

**Built with ❤️ for the Digital Life Lessons community**
#   B L O G - C L I E N T 
 
 
