var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
   createdEvents: [
       {
           type: ObjectId,
           ref: 'Event'
       }
   ]
});

module.exports = mongoose.model('User', userSchema);