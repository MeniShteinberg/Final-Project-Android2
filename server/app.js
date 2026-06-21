require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const cloudinary = require('cloudinary').v2;

// Initialize Express app
const app = express();

// Setup global middlewares
app.use(cors());
app.use(bodyParser.json());

// Configure Cloudinary for image uploads
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Import Mongoose models
const User = require('./models/user');
const Post = require('./models/post');
const Message = require('./models/message');

// Import application routes
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const statsRoutes = require('./routes/stats');
const groupRoutes = require('./routes/group');
const feedRoutes = require('./routes/feed');

// Register API routes
app.use('/api/users', userRoutes); 
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/feed', feedRoutes);

// Create HTTP server and initialize WebSockets (Socket.io)
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Handle WebSocket connections and real-time events
io.on('connection', (socket) => {
  console.log('🟢 A user connected');

  socket.on('chat message', async (msg) => {
    console.log('📨 Message received:', msg);
    const newMessage = new Message(msg);
    await newMessage.save();
    io.emit('chat message', newMessage); // Broadcast message to all clients
  });

  socket.on('disconnect', () => {
    console.log('🔴 A user disconnected');
  });
});

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('🔹 Connected successfully to MongoDB');
    
    // Start listening for incoming requests ONLY after a successful DB connection
    const PORT = 5000;
    server.listen(PORT, () => {
      console.log(`✅ Server + WebSocket running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed!', err.message);
  });