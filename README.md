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

#### DevOps & Tools
- 📦 Package Manager: npm/yarn
- 🔄 Version Control: Git
- 🐳 Containerization: Docker (optional)
- 📝 API Documentation: Swagger/OpenAPI
- 🧪 Testing: Jest
- 📊 Code Quality: ESLint, Prettier
- 🔄 CI/CD: GitHub Actions

### Prerequisites
- Node.js 18 or higher
- MongoDB 7.x
- npm or yarn
- Git

### Getting Started

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

3. Set up environment variables:
```bash
# Backend (.env)
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
DIALOGFLOW_PROJECT_ID=your_dialogflow_project_id

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd frontend
npm run dev
```

### API Documentation
- Base URL: `http://localhost:5000/api`
- Documentation: `http://localhost:5000/api-docs`

### Development Guidelines
- Follow ESLint and Prettier configurations
- Write unit tests for new features
- Follow Git branching strategy
- Document API changes in Swagger
- Keep dependencies updated

### Deployment
- Backend: Node.js server (PM2)
- Frontend: Vercel/Netlify
- Database: MongoDB Atlas
- Storage: AWS S3
- Monitoring: PM2/Sentry
- SSL: Let's Encrypt

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📞 Support
For support, email support@renthousebd.com or join our Slack channel.
