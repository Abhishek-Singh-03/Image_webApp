const express = require('express');
const router = express.Router();
const { saveList, getAllLists, deleteList, updateList, getSingleList } = require('../Controllers/ListController');
const ensureAuthenticated = require('../Middlewares/Auth'); // Ensure user is authenticated

// Save a new list
router.post('/save', ensureAuthenticated, saveList);

// Get all lists for the logged-in user
router.get('/all', ensureAuthenticated, getAllLists);

router.get('/single/:id', ensureAuthenticated, getSingleList);


// Delete a list by ID
router.delete('/:id', ensureAuthenticated, deleteList);

// Update a list by ID
router.put('/:id', ensureAuthenticated, updateList);

module.exports = router;
