'use strict';

const express = require('express');
const bersinQuark = require('../controllers/grid');
const router = express.Router();

// ROUTES
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Tech Challenge Solution!',
  });
});

router.get('/assets/publish/:id', (req, res) => {

});

module.exports = router;
