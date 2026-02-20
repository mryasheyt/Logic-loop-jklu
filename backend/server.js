require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const rateLimiter = require('./middleware/rateLimiter');
const startCronJobs = require('./cron/jobs');

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});

// Make io accessible in routes
app.set('io', io);

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(rateLimiter);

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/mood', require('./middleware/auth'), require('./routes/mood.routes'));
app.use('/api/chat', require('./routes/chat.routes'));
app.use('/api/journal', require('./routes/journal.routes'));
app.use('/api/burnout', require('./routes/burnout.routes'));
app.use('/api/peer', require('./routes/peer.routes'));
app.use('/api/nudges', require('./routes/nudge.routes'));
app.use('/api/crisis', require('./routes/crisis.routes'));
app.use('/api/counselor', require('./routes/counselor.routes'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.io connections
io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`[Socket] User ${userId} joined room`);
    });

    socket.on('disconnect', () => {
        console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
});

// Start server
const PORT = process.env.PORT || 5000;

const start = async () => {
    await connectDB();
    startCronJobs();
    server.listen(PORT, () => {
        console.log(`\n🧠 MindMate AI Backend running on port ${PORT}`);
        console.log(`   API: http://localhost:${PORT}/api`);
        console.log(`   Health: http://localhost:${PORT}/api/health\n`);
    });
};

start();
