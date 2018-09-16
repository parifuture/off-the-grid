'use strict';

const express = require('express');
const grid = require('../controllers/grid');
const router = express.Router();

// ROUTES
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Tech Challenge Solution!',
  });
});

router.get('/money/spent/', (req, res) => {
  grid.totalMoneySpent()
  .then(response => {
    res.json(response)
  })
  .catch(err => {
    res.status(400);
    res.json(err);
  });
});

router.get('/popular/truck/', (req, res) => {
  grid.mostPopularStandByWaitTime()
  .then(response => {
    res.json(response)
  })
  .catch(err => {
    res.status(400);
    res.json(err);
  });
});

router.get('/recommendation/bytime/:time', (req, res) => {
  const timeInMin = req.params.time ? req.params.time : null;
  grid.getStandRecommendationByTime(timeInMin)
  .then(response => {
    res.json(response)
  })
  .catch(err => {
    res.status(400);
    res.json(err);
  });
});

module.exports = router;
