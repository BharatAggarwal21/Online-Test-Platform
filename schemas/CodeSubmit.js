var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var codeSubmitSchema = new Schema({
    questionId: {type: String, required: true},   //The question to which this activity is related
    userId: {type: String, required: true},
    timeOnTimer: {type: String, required: true},
    code: [{type: String, required: true}],
    language: {type: String, required: true},
    submissionTime: {type: Number, required: true}
});

var CodeSubmit = mongoose.model("CodeSubmit", codeSubmitSchema);
module.exports = CodeSubmit;