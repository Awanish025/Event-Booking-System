const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./config/db');
require('dotenv').config();

// Initialize Express App
const app = express();

// Create HTTP server to work with Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO for real-time communication
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for development (restrict in production)
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware Configuration
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests
app.use('/uploads', express.static('uploads')); // Serve uploaded images statically

// Database Connection Check
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to MySQL Database');
    connection.release(); // Release connection back to pool
  }
});

// Import Routes
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Mount Routes
app.use('/events', eventRoutes); // All event-related requests start with /events
app.use('/bookings', bookingRoutes); // All booking-related requests start with /bookings

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io instance accessible in routes/controllers via req.app.get('io')
app.set('io', io);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
