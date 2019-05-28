var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var bookingSchema = new mongoose.Schema({
    event: {
        type: ObjectId,
        ref: 'Event'
    },
    user: {
        type: ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);