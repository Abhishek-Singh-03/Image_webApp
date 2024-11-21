const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    filter: { type: String, required: true },
    images: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
});

const List = mongoose.model('List', ListSchema);

module.exports = List;
