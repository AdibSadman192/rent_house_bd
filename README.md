# 🏠 RentHouseBD

[![Create Release](https://github.com/AdibSadman192/rent_house_bd/actions/workflows/release.yml/badge.svg)](https://github.com/AdibSadman192/rent_house_bd/actions/workflows/release.yml) <div align='center'><a href='https://www.websitecounterfree.com'><img src='https://www.websitecounterfree.com/c.php?d=9&id=65510&s=3' border='0' alt='Free Website Counter'></a></div>





## 🖼️ Project Previews

### Landing Page
![Landing Preview](/preview/landing_page.jpeg)
### Dashboard
![Dashboard Preview](/preview/Dashboard_user.jpeg)
### Contact Page
![Contact Preview](/preview/Contact_page.jpeg)
### FAQ Page
![FAQ Preview](/preview/FAQ_page.jpeg)
### About Page
![About Preview](/preview/about_page.jpeg)
### Help Center
![Help Center Preview](/preview/help_center.jpeg)







*Note: The platform features a modern, responsive design with glass-morphism UI elements. More previews are coming soon as the project progresses.*

## 🌟 Overview
A modern social media platform and service for house rentals in Bangladesh, connecting tenants with property owners through a community-driven approach.

## 🎯 Purpose
The platform serves as both a social network and rental service, making it easier for people in Bangladesh to find and list rental properties while building trusted connections within local communities.

## 👥 Key User Types
- 👤 Regular Users (Tenants)
- 🏘️ Property Owners
- 👨‍🎓 Bachelors
- 👨‍👩‍👧‍👦 Families
- 🎓 Students
- 👨‍💼 Administrators

## ✨ Features

### 🤝 Social & Community Features
- 💬 Real-time chat between users
- ⭐ Community reviews and ratings
- 🔄 Social sharing capabilities
- 👥 User profiles and reputation system
- 📍 Area-based community groups
- 🤖 AI-powered chatbot support

### 🏡 Rental Services
- 📝 Property listing and management
- 🔍 Advanced property search with filters
- 📅 Booking management system
- 📄 Document verification
- 💳 Payment processing
- 📊 Property availability tracking

### 🎯 Specialized Categories
- 🏢 Apartments
- 🏠 Houses
- 🎓 Student hostels
- 👥 Mess accommodations
- 🔄 Sublet options
- 👨‍👩‍👧‍👦 Family units
- 👨‍🎓 Bachelor accommodations

### 🔒 Security Features
- 🔐 JWT Authentication
- 🔑 Password Hashing
- 🛡️ CORS Protection
- 🔒 HTTP Security Headers
- 🚫 Rate Limiting
- 🧹 XSS Prevention
- 🔍 Input Validation
- 📝 Activity Logging

## 🗺️ Project Roadmap

### Phase 1: Foundation (Current)
- [x] Project setup and architecture
- [x] Basic UI components with glass-morphism design
- [x] Authentication system
- [ ] Property listing core features
- [ ] Search and filter functionality

### Phase 2: Enhanced Features (Q1 2025)
- [ ] Advanced property search with map integration
- [ ] Real-time chat between users and property owners
- [ ] Virtual tour integration
- [ ] Review and rating system
- [ ] Payment integration

### Phase 3: Advanced Features (Q2 2025)
- [ ] AI-powered property recommendations
- [ ] Automated rental agreement generation
- [ ] Mobile app development
- [ ] Analytics dashboard for property owners
- [ ] Multi-language support

### Phase 4: Scaling & Optimization (Q3 2025)
- [ ] Performance optimization
- [ ] SEO enhancement
- [ ] Advanced analytics
- [ ] Market analysis tools
- [ ] API marketplace for third-party integrations

## 🛠️ Development

### Tech Stack

#### Backend
- ⚙️ Runtime: Node.js (v18+)
- 🚀 Framework: Express.js (v4.18.2)
- 📦 Database: MongoDB (v7.5.0)
- 🔄 ODM: Mongoose (v7.5.0)
- 🔌 Real-time: Socket.IO (v4.7.2)
- 🔐 Authentication: JWT (v9.0.2)
- ☁️ Storage: AWS S3
- 🤖 AI: Dialogflow (v4.7.0)
- 📝 Logging: Morgan
- 🛡️ Security: Helmet, XSS-Clean, Express-Rate-Limit

#### Frontend
- ⚛️ Framework: Next.js 13 (React 18)
- 🎨 UI Library: Material-UI (v5.15.10)
- 📝 Forms: Formik (v2.4.5)
- 🗺️ Maps: Leaflet (v1.9.4)
- 📊 Charts: Recharts (v2.8.0)
- ✨ Icons: Material Icons
- 🔄 State Management: React Context
- 📡 HTTP Client: Axios
- 🎭 Form Validation: Yup

### 📁 Project Structure
```
rent_house_bd/
├── backend/                 # Backend server application
│   ├── config/             # Configuration files
│   │   ├── database.js     # Database configuration
│   │   ├── dialogflow.js   # Chatbot configuration
│   │   └── swagger.js      # API documentation
│   ├── controllers/        # Request handlers
│   │   ├── authController.js
│   │   ├── propertyController.js
│   │   ├── bookingController.js
│   │   └── ...
│   ├── middleware/         # Express middleware
│   │   ├── auth.js         # Authentication middleware
│   │   ├── errorHandler.js # Error handling
│   │   └── upload.js       # File upload handling
│   ├── models/            # Database models
│   │   ├── User.js
│   │   ├── Property.js
│   │   ├── Booking.js
│   │   └── ...
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── properties.js
│   │   └── ...
│   ├── services/          # Business logic
│   └── utils/             # Helper functions
│
├── frontend/              # Next.js frontend application
│   ├── components/        # Reusable React components
│   │   ├── common/        # Shared components
│   │   ├── dashboard/     # Dashboard components
│   │   └── property/      # Property-related components
│   ├── contexts/          # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/              # Utility libraries
│   ├── pages/            # Next.js pages
│   │   ├── api/          # API routes
│   │   ├── auth/         # Authentication pages
│   │   ├── dashboard/    # Dashboard pages
│   │   └── properties/   # Property pages
│   ├── public/           # Static files
│   │   ├── images/
│   │   └── icons/
│   └── styles/           # CSS and styling files
│
├── docs/                 # Documentation files
└── preview/             # Project preview images
```

### Prerequisites
- Node.js 18 or higher
- MongoDB 7.x
- npm or yarn
- Git

### Getting Started

1. Clone the repository:
```bash
git clone https://github.com/AdibSadman192/rent_house_bd.git
cd rent_house_bd
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
```bash
# Backend (.env)
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
S3_BUCKET_NAME=your_s3_bucket_name

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

4. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd ../frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
