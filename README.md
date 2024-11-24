# 🏠 rent_house_bd

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

## ✨ Core Features

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

## 🛠️ Tech Stack

### Backend
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

### Frontend
- ⚛️ Framework: Next.js 13 (React 18)
- 🎨 UI Library: Material-UI (v5.15.10)
- 📝 Forms: Formik (v2.4.5)
- 🗺️ Maps: Leaflet (v1.9.4)
- 📊 Charts: Recharts (v2.8.0)
- ✨ Icons: Material Icons
- 🔄 State Management: React Context
- 📡 HTTP Client: Axios
- 🎭 Form Validation: Yup

### DevOps & Tools
- 📦 Package Manager: npm/yarn
- 🔄 Version Control: Git
- 🐳 Containerization: Docker (optional)
- 📝 API Documentation: Swagger/OpenAPI
- 🧪 Testing: Jest
- 📊 Code Quality: ESLint, Prettier
- 🔄 CI/CD: GitHub Actions

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB 7.x
- npm or yarn
- Git

### Environment Setup
1. Clone the repository:
```bash
git clone https://github.com/yourusername/rent_house_bd.git
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

3. Configure environment variables:
```bash
# Backend (.env)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rent_house_bd
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_bucket_name

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### Running the Application
1. Start MongoDB service
2. Run the backend:
```bash
cd backend
npm run dev
```

3. Run the frontend:
```bash
cd frontend
npm run dev
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📝 API Documentation

### Core Endpoints
- Authentication:
  - POST /api/auth/register
  - POST /api/auth/login
  - GET /api/auth/verify
- Properties:
  - GET /api/properties
  - POST /api/properties
  - GET /api/properties/:id
  - PUT /api/properties/:id
- Users:
  - GET /api/users/profile
  - PUT /api/users/profile
- Bookings:
  - POST /api/bookings
  - GET /api/bookings/user
  - PUT /api/bookings/:id

Full API documentation available at `/api-docs` endpoint.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch:
```bash
git checkout -b feature/AmazingFeature
```

3. Follow coding standards:
- Use ESLint and Prettier
- Follow the existing code style
- Write meaningful commit messages
- Add appropriate comments and documentation

4. Commit your changes:
```bash
git commit -m 'Add some AmazingFeature'
```

5. Push to the branch:
```bash
git push origin feature/AmazingFeature
```

6. Open a Pull Request

### Coding Standards
- Use TypeScript for new features
- Follow SOLID principles
- Write unit tests for new features
- Update documentation as needed
- Use meaningful variable and function names
- Keep functions small and focused

## 🔒 Security Features
- 🔒 JWT Authentication
- 🛡️ Rate Limiting
- 🔐 XSS Protection
- 🧹 MongoDB Sanitization
- 📁 Secure File Uploads
- ✅ Input Validation
- 👮 Role-based Access Control
- 🔑 Password Hashing
- 🛡️ CORS Protection
- 🔒 HTTP Security Headers

## 🔍 Key Features
- 📍 Location-based property search
- 💰 BDT currency support
- 🎯 Advanced filtering options
- 📊 Property analytics
- 📄 Document verification
- 🔔 Real-time notifications
- 🏠 Virtual property tours
- 💹 Dynamic pricing
- 📈 Performance monitoring
- 🔍 SEO optimization

## 💡 Unique Selling Points
- Community-driven approach
- Focus on Bangladesh rental market
- Specialized filters for different user types
- Real-time communication
- Verified listings
- Local area expertise
- Sublet opportunities
- Trust-based community features

## 📈 Project Structure
```
rent_house_bd/
├── backend/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Custom middleware
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── utils/         # Utility functions
│   └── server.js      # Entry point
├── frontend/
│   ├── components/    # Reusable components
│   ├── contexts/      # React contexts
│   ├── pages/         # Next.js pages
│   ├── public/        # Static files
│   ├── styles/        # CSS styles
│   └── utils/         # Utility functions
└── docs/             # Documentation
```

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributors
- [Me](https://github.com/Adibsadman192) - Initial work

## 🙏 Acknowledgments
- Hat tip to anyone whose code was used
- Inspiration
- etc
