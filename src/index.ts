import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Import Routes
import authRoutes from './routes/auth';
import ConnectDB from './config/db';
import morgan from 'morgan';
import morganBody from 'morgan-body';

// Event Listener for User Registration
import './events/users/AuthEventsListener';

// Import Multer configuration
import upload from './utils/multer';
import { asyncLocalMiddleware } from "./middleware/asyncLocalStorage";

dotenv.config();
const app = express();
app.use(asyncLocalMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));

// Serve static files from your uploads folder.
// Adjust the static path if needed so that it matches where Multer stores files.
app.use("/src/public/uploads", express.static("./src/public/uploads"));

const PORT = process.env.PORT || 3000;

ConnectDB();

morganBody(app, {
    prettify: true,
    logReqUserAgent: true,
    logReqDateTime: true,
});


// Example route to handle file uploads using Multer middleware.
// This route expects a file with field name "file".
// You can change to upload.single('image') or upload.fields(...) based on your needs.
app.post("/api/v1/upload", upload.single("file"), (req: Request, res: Response) => {
    res.status(200).json({
        message: "File uploaded successfully",
        file: req.file,
    });
});

// Register Routes
app.use('/api/v1/users/auth', authRoutes);

// Setup HTTP server with Socket.IO
const server = http.createServer(app);
const io = new SocketIOServer(server);

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('message', (msg) => {
        console.log('Received message:', msg);
        io.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the Server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
