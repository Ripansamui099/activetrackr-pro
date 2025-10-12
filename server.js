const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/healthfitness', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ========== SCHEMAS ==========

// User Management Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Content Moderation Schema
const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  contentType: { type: String, required: true },
  author: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Report Generation Schema
const reportSchema = new mongoose.Schema({
  reportName: { type: String, required: true },
  reportType: { type: String, required: true },
  dateRange: { type: String, required: true },
  metrics: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Feedback Analysis Schema
const feedbackSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  feedbackType: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Product Management Schema
const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Daily Activity Schema
const activitySchema = new mongoose.Schema({
  activityType: { type: String, required: true },
  duration: { type: Number, required: true },
  calories: { type: Number, required: true },
  date: { type: Date, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Goal Tracking Schema
const goalSchema = new mongoose.Schema({
  goalName: { type: String, required: true },
  goalType: { type: String, required: true },
  targetValue: { type: Number, required: true },
  currentValue: { type: Number, required: true },
  deadline: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Workout Routine Schema
const workoutSchema = new mongoose.Schema({
  workoutName: { type: String, required: true },
  exercises: { type: String, required: true },
  duration: { type: Number, required: true },
  difficulty: { type: String, required: true },
  targetMuscles: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Trainer Assignment Schema
const trainerSchema = new mongoose.Schema({
  trainerName: { type: String, required: true },
  specialization: { type: String, required: true },
  clientName: { type: String, required: true },
  sessionType: { type: String, required: true },
  schedule: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// ========== MODELS ==========
const User = mongoose.model('User', userSchema);
const Content = mongoose.model('Content', contentSchema);
const Report = mongoose.model('Report', reportSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);
const Product = mongoose.model('Product', productSchema);
const Activity = mongoose.model('Activity', activitySchema);
const Goal = mongoose.model('Goal', goalSchema);
const Workout = mongoose.model('Workout', workoutSchema);
const Trainer = mongoose.model('Trainer', trainerSchema);

// ========== GENERIC CRUD ROUTES GENERATOR ==========
function createCRUDRoutes(modelName, Model) {
  // CREATE
  app.post(`/api/${modelName}`, async (req, res) => {
    try {
      const newItem = new Model(req.body);
      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // READ ALL
  app.get(`/api/${modelName}`, async (req, res) => {
    try {
      const items = await Model.find();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // READ ONE
  app.get(`/api/${modelName}/:id`, async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Item not found' });
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // UPDATE
  app.put(`/api/${modelName}/:id`, async (req, res) => {
    try {
      const updatedItem = await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
      res.json(updatedItem);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE
  app.delete(`/api/${modelName}/:id`, async (req, res) => {
    try {
      const deletedItem = await Model.findByIdAndDelete(req.params.id);
      if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
      res.json({ message: 'Item deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // SEARCH
  app.get(`/api/${modelName}/search/:query`, async (req, res) => {
    try {
      const searchQuery = req.params.query;
      const regex = new RegExp(searchQuery, 'i');
      
      // Get all fields from schema
      const fields = Object.keys(Model.schema.paths).filter(
        field => field !== '_id' && field !== '__v' && field !== 'createdAt'
      );
      
      // Create search conditions for all text fields
      const searchConditions = fields
        .filter(field => Model.schema.paths[field].instance === 'String')
        .map(field => ({ [field]: regex }));
      
      const items = await Model.find({
        $or: searchConditions.length > 0 ? searchConditions : [{}]
      });
      
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
}

// ========== CREATE ALL ROUTES ==========
createCRUDRoutes('users', User);
createCRUDRoutes('contents', Content);
createCRUDRoutes('reports', Report);
createCRUDRoutes('feedbacks', Feedback);
createCRUDRoutes('products', Product);
createCRUDRoutes('activities', Activity);
createCRUDRoutes('goals', Goal);
createCRUDRoutes('workouts', Workout);
createCRUDRoutes('trainers', Trainer);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Health & Fitness API is running' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 MongoDB: mongodb://localhost:27017/healthfitness`);
});
