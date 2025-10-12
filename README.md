# Health & Fitness Platform - Full Stack Application

A comprehensive full-stack Health & Fitness management platform built with React.js and MongoDB.

## Features

### 🎯 5 Main Modules

1. **Admin Dashboard**
   - User Management
   - Content Moderation

2. **Analytics & Reports**
   - Report Generation
   - Feedback Analysis

3. **E-commerce**
   - Product Management

4. **Activity Tracking**
   - Daily Activity Logging
   - Goal Tracking

5. **Workout & Trainer**
   - Workout Routine Management
   - Trainer Assignment

### ✨ Core Functionality

- ✅ **CRUD Operations**: Create, Read, Update, Delete on all forms
- ✅ **Search Functionality**: Search across all data
- ✅ **Form Validations**: Comprehensive validation on all inputs
- ✅ **Responsive Design**: Beautiful UI that works on all devices

### 🚀 React Concepts Implemented

- ✅ Functional Components
- ✅ Class Components
- ✅ Hooks (useState, useEffect)
- ✅ State Management
- ✅ Properties (Props)
- ✅ Conditional Rendering
- ✅ Routing (React Router)
- ✅ List & Keys
- ✅ Map Function
- ✅ Stateless Components

## Prerequisites

- Node.js (v14 or higher)
- MongoDB installed and running locally
- MongoDB Compass (optional, for database visualization)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-folder>
```

2. Install dependencies:
```bash
npm install
```

3. Make sure MongoDB is running on `mongodb://localhost:27017`

## Running the Application

### Start Backend Server (Terminal 1):
```bash
node server.js
```
The backend will run on `http://localhost:5000`

### Start Frontend (Terminal 2):
```bash
npm run dev
```
The frontend will run on `http://localhost:8080`

## Quick Start (Single Command)

You can also run both servers with:
```bash
npm run dev
```
Then in another terminal:
```bash
node server.js
```

## Database

- **Database Name**: `healthfitness`
- **Connection String**: `mongodb://localhost:27017/healthfitness`

### Collections:
- users
- contents
- reports
- feedbacks
- products
- activities
- goals
- workouts
- trainers

## API Endpoints

All endpoints follow the pattern: `http://localhost:5000/api/{collection}`

### Available Operations:
- `GET /api/{collection}` - Get all records
- `GET /api/{collection}/:id` - Get single record
- `POST /api/{collection}` - Create record
- `PUT /api/{collection}/:id` - Update record
- `DELETE /api/{collection}/:id` - Delete record
- `GET /api/{collection}/search/:query` - Search records

### Example Collections:
- users
- contents
- reports
- feedbacks
- products
- activities
- goals
- workouts
- trainers

## Tech Stack

### Frontend:
- React.js
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- React Router
- Axios
- React Query

### Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS

## Project Structure

```
├── src/
│   ├── components/      # Reusable components
│   ├── pages/           # Page components (9 forms)
│   ├── lib/            # Utility functions & API
│   └── index.css       # Design system
├── server.js           # Backend server (single file)
└── package.json        # Dependencies
```

## Features by Module

### Module 1: Admin Dashboard
- User Management with roles and status
- Content Moderation with approval workflow

### Module 2: Analytics & Reports  
- Report Generation with multiple metrics
- Feedback Analysis with ratings

### Module 3: E-commerce
- Product Management with inventory tracking

### Module 4: Activity Tracking
- Daily Activity logging with calories
- Goal Tracking with progress indicators

### Module 5: Workout & Trainer
- Workout Routine creation with difficulty levels
- Trainer Assignment with scheduling

## Design System

The app uses a modern, vibrant design system with:
- Purple-blue gradients for primary actions
- Orange accents for energy
- Green for success/health indicators
- Smooth animations and transitions
- Dark sidebar with light content area

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

## License

MIT License
