require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const tasksRouter = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/task-manager';

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/tasks', tasksRouter);

// simple root/health endpoints
app.get('/', (req, res) => res.send('Task Manager API'));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// connect and listen
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
