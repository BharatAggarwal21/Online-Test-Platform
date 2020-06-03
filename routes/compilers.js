const express = require('express');
const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const responseHelpers = require('../helpers/response');
const compiler = require('../compiler/compiler');
const router = express.Router();
const CodeSubmit = require('../schemas/CodeSubmit');
const UserActivity = require('../schemas/UserActivity');

router.post('/compile', (req, res) => {
    console.log("its body");
    console.log(req.body);

    var code = new compiler.Code(req.body.language, req.body.code);
    var promise = compiler.compile(code);
    promise.then(result => {
        responseHelpers.success(res, result);
        console.log("successful check submission");
        console.log(result);
    }).catch(err => {
        console.error("its an error");
        responseHelpers.failure(res, err);
    });
});

router.post('/submit', async (req, res) => {
    console.log(req.body);
    var codeSubmit = new CodeSubmit({
        code: req.body.code,
        language: req.body.language,
        questionId: req.body.questionId,
        userId: req.body.userId,
        timeOnTimer: req.body.timeOnTimer,
        submissionTime: req.body.submissionTime
    });
 
    let codeResponse;

    try {
        codeResponse = await codeSubmit.save();
        
        const userActivityArray = req.body.userActivity.map((userActivity) => {
            return new UserActivity({
                codeSubmitId: codeResponse._id,
                questionId: userActivity.questionId,
                userId: userActivity.userId,
                timeOnTimer: userActivity.timeOnTimer,
                activityType: userActivity.activityType,
                time: userActivity.time,
                message: userActivity.message
            });
        });
        const userActivityResponse = await UserActivity.insertMany(userActivityArray);

        responseHelpers.success(res, {
            message: "Code submission successful."
        });
    } catch (e) {
        try {
            if (codeResponse !== undefined) {
                await CodeSubmit.remove({ _id: codeResponse._id});
            }
        } catch (e) { }

        console.log(e);
        responseHelpers.failure(res, {
            message: "Unable to submit code. Please try again."
        });
    }
});

module.exports = router;