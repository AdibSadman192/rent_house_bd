# Database Seeding Script

## Overview
This script populates the RentHouse BD database with sample data for development and testing purposes.

## Features
- Generates realistic Bangladeshi property data
- Creates sample users with different roles:
  - Admin
  - Property Owners
  - Renters
- Generates properties with:
  - Realistic Bangladeshi locations
  - Varied property types
  - Random amenities
  - Dynamic images
- Creates sample bookings

## Prerequisites
- MongoDB running locally or connection to a MongoDB instance
- Node.js installed
- Backend dependencies installed

## Usage
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run the seed script
npm run seed
```

## Important Notes
- This script will CLEAR existing data in the database
- Use only in development/testing environments
- Modify the MongoDB connection string in the script if needed

## Data Generation Details
- 1 Admin User
- 10 Property Owners
- 20 Renters
- 50 Properties
- 30 Bookings

## Customization
You can modify the script to:
- Change the number of generated users/properties
- Add more specific Bangladeshi location data
- Adjust property types and amenities
