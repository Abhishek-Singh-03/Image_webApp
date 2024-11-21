const List = require('../Models/List'); // Your List model
const { validationResult } = require('express-validator');

// Save a new list
exports.saveList = async (req, res) => {
    try {
       
        const { name, filter, images, createdAt } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const newList = new List({
            name,
            filter,
            images,
            createdAt,
            userId: req.user._id, 
        });

        await newList.save();

        res.status(201).json({
            success: true,
            message: 'List saved successfully!',
            list: newList,
        });
    } catch (err) {
        console.error("Error saving list:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get all lists for the logged-in user
exports.getAllLists = async (req, res) => {
    try {
        const lists = await List.find({ userId: req.user._id }); 

        res.status(200).json({
            success: true,
            lists,
        });
    } catch (err) {
        console.error("Error fetching lists:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getSingleList = async (req, res) => {
    try {
        const { id } = req.params;  
        const list = await List.findById(id); 

        if (!list) {
            return res.status(404).json({
                success: false,
                message: 'List not found',
            });
        }

        res.status(200).json({
            success: true,
            list,
        });
    } catch (err) {
        console.error("Error fetching list:", err);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};  

// Delete a list by ID
exports.deleteList = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const list = await List.findOneAndDelete({ _id: id, userId: req.user._id });

        if (!list) {
            return res.status(404).json({
                success: false,
                message: 'List not found or you are not authorized to delete this list',
            });
        }

        res.status(200).json({
            success: true,
            message: 'List deleted successfully',
        });
    } catch (err) {
        console.error("Error deleting list:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update a list by ID
exports.updateList = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, filter, images } = req.body;

        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const updatedList = await List.findOneAndUpdate(
            { _id: id, userId: req.user._id }, // Only allow the user to update their own lists
            { name, filter, images },
            { new: true }
        );

        if (!updatedList) {
            return res.status(404).json({
                success: false,
                message: 'List not found or you are not authorized to update this list',
            });
        }

        res.status(200).json({
            success: true,
            message: 'List updated successfully',
            list: updatedList,
        });
    } catch (err) {
        console.error("Error updating list:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

