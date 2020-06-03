var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userActivitySchema = new Schema({
    codeSubmitId: {type: String, required: true},
    questionId: {type: String, required: true},   //The question to which this activity is related
    userId: {type: String, required: true},
    timeOnTimer: {type: String, required: true},
    activityType: {type: String, required: true},
    time: {type: Number, required: true},
    message: {type: String}
});

var UserActivity = mongoose.model("UserActivity", userActivitySchema);
module.exports = UserActivity;