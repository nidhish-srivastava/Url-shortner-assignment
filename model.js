const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({
    originalUrl: { type: String, required: true },
    shortId: { type: String, required: true, unique: true, index: true },  // Index added here
    clicks: { type: Number, default: 0 },
    lastAccessed: { type: Date, default: null }
});

// Create an index on the shortId field(which tells db to create indexing in ascending order)
urlSchema.index({ shortId: 1 });

module.exports = mongoose.model('URL', urlSchema);
