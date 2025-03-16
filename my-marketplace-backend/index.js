require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const AWS = require('aws-sdk');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(bodyParser.json());

// Configure AWS with your access and secret key.
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Create S3 instance
const s3 = new AWS.S3();

// In-memory store for notifications (replace with a database in production)
const notifications = [];

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Send existing notifications to newly connected client
  socket.emit('notifications', notifications);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Multer setup to parse multipart/form-data
// This will store the file in memory as a Buffer, giving you fine control
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload endpoint to handle single file named 'photo'
app.post('/upload', (req, res, next) => {
  console.log('Request received:', {
    contentType: req.headers['content-type'],
    bodySize: req.headers['content-length']
  });
  next();
}, upload.single('photo'), async (req, res) => {
  console.log('After multer:', {
    file: req.file ? 'File received' : 'No file',
    fileDetails: req.file
  });
  
  try {
    // If no file was provided
    if (!req.file) {
      return res.status(400).send({ message: 'No file provided' });
    }

    // Construct the S3 upload parameters
    const params = {
      Bucket: "userimagesaisushackathon",
      Key: `uploads/${Date.now()}_${path.extname(req.file.originalname)}`, // or any unique name
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    };

    // Upload file to S3
    const uploadResult = await s3.upload(params).promise();
    console.log('File uploaded successfully:', uploadResult.Location);

    // Return the S3 file URL in the response
    return res.status(200).send({ url: uploadResult.Location });
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).send({ message: 'Error uploading file', error });
  }
});

// Get all notifications
app.get('/notifications', (req, res) => {
  res.status(200).json(notifications);
});

// Webhook endpoint for third parties to send notifications
app.post('/webhook/notifications', (req, res) => {
  try {
    const { title, message, type, timestamp, sender } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }
    
    const notification = {
      id: Date.now().toString(),
      title,
      message,
      type: type || 'info',
      timestamp: timestamp || new Date().toISOString(),
      sender: sender || 'system',
      read: false
    };
    
    notifications.unshift(notification); // Add to the beginning of the array
    
    // Limit the number of stored notifications (optional)
    if (notifications.length > 100) {
      notifications.pop();
    }
    
    console.log('New notification received:', notification);
    
    // Emit the new notification to all connected clients
    io.emit('new_notification', notification);
    
    return res.status(201).json({ success: true, notification });
  } catch (error) {
    console.error('Error processing notification:', error);
    return res.status(500).json({ error: 'Failed to process notification' });
  }
});

// Mark notification as read
app.put('/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  const notificationIndex = notifications.findIndex(n => n.id === id);
  
  if (notificationIndex === -1) {
    return res.status(404).json({ error: 'Notification not found' });
  }
  
  notifications[notificationIndex].read = true;
  
  // Emit the updated notification to all connected clients
  io.emit('notification_read', notifications[notificationIndex]);
  
  return res.status(200).json(notifications[notificationIndex]);
});

// Clear all notifications (for testing purposes)
app.delete('/notifications', (req, res) => {
  notifications.length = 0;
  
  // Emit the empty notifications array to all connected clients
  io.emit('notifications', notifications);
  
  return res.status(200).json({ success: true, message: 'All notifications cleared' });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
