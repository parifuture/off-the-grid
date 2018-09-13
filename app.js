'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const config = require('./config/config');

const app = express();

// static assets folder including html
app.use(express.static('public'));
// allows us to get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set paths and routes
app.use('/api', apiRoutes);

// error handlers
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


const nodeport = config.server.port;
// Set Port
app.set('port', (process.env.PORT || nodeport));

app.listen(nodeport);
