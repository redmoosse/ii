/**
 * App configuration
 */
const http = require('http');
const express = require('express');
const passport = require('passport');
const protectedRoutes = require('./routes/modelRoutes');

require('dotenv').config();
require('./auth/googleStrategy');
const swaggerUi = require('swagger-ui-express');

const { Server } = require('socket.io');
const swaggerSpec = require('./configs/swaggerConfig');
const { registerModelHandlers } = require('./socket/modelSocket');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(express.json());

const modelRoutes = require('./routes/modelRoutes');
const authRoutes = require('./auth/authRoutes');

app.use(passport.initialize());
app.use('/auth', authRoutes);
app.use('/model', modelRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/protected', protectedRoutes);

io.on('connection', (socket) => {
  console.log('Client connected: ', socket.id);
  registerModelHandlers(socket);
});

module.exports = server;
