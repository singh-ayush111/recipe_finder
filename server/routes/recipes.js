const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Auth Error' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};


router.get('/search', async (req, res) => {
  try {
    const { type, term } = req.query;
    let apiUrl = '';

    if (type === 'ingredient') {
      apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${term}`;
    } else if (type === 'category') {
      apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${term}`;
    } else if (type === 'area') {
      apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${term}`;
    } else {
      return res.status(400).json({ error: 'Invalid search type' });
    }

    const response = await axios.get(apiUrl);
    res.json(response.data.meals || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

router.post('/favorites', auth, async (req, res) => {
  try {
    const { id, title, image } = req.body;
    const user = await User.findById(req.userId);
    if (!user.favorites.some(fav => fav.id === id)) {
      user.favorites.push({ id, title, image });
      await user.save();
    }
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    res.json(response.data.meals[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recipe details' });
  }
});

router.delete('/favorites/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.favorites = user.favorites.filter(fav => fav.id !== req.params.id);
    await user.save();
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/favorites/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.favorites = user.favorites.filter(fav => fav.id !== req.params.id);
    await user.save();
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;