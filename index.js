// Main starting point for application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');

// Db setup
mongoose.connect('mongodb://localhost:auth/auth'); // creates an 'auth' database

// App setup
const app = express();
// load our middlewares
app.use(morgan('combined')); // logs http requests
app.use(bodyParser.json({ type: '*/*' })); // helps parse incoming http requests
router(app);

// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on port: ', port);
