const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var questionSchema = new Schema({
    question: [{type: String, required: true}],
    testCases: [{input: String, output: String}],
    shortCode: {type: String},
    timer: {type: String, required: true}
});

var Question = mongoose.model('Question', questionSchema);
module.exports = Question;