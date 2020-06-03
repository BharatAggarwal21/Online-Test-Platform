const express = require('express');
const path = require('path');
const router = express.Router();
const Question = require('../schemas/Question');

router.get('/', (req, res) => {
    //res.sendFile(path.join(path.dirname(__dirname), "public", "index.html"));
    res.render('editor', {question: "Edsonet - Online Code Editor."});
});

/*
Question ID will be sent in the Post request.
Retrieve the question from database and send rendered page.
*/
router.post('/', (req, res) => {
    const questionId = req.body.questionId;
 
    Question.findOne({_id: questionId})
        .then(doc => {
            console.log(doc);
            res.render('editor', {question: doc.question});
        })
        .catch(err => {
            console.log(err);
            res.render('editor', {question: "Edsonet - Online Code Editor."});
        });
});

router.get('/questionId/:questionId/:userId', (req, res) => {
    const questionId = req.params.questionId;
    const userId = req.params.userId;

    Question.findOne({_id: questionId})
        .then(doc => {
            console.log(doc);
            res.render('editor', {
                question: doc.question, 
                isFromEdsonet: true,
                timer: doc.timer,
                questionId,
                userId
            });
        })
        .catch(err => {
            console.log("Error occurred!");
            console.log(questionId);
            console.log(err);
            res.render('editor', {
                question: "Edsonet - Online Code Editor.", 
                isFromEdsonet: false,
                timer: 5,
                questionId: "test-id"
            });
        });
});

router.get('/createTest', (req, res) => {
    res.render('createTest');
});

router.get('/testDetails', (req, res) => {
    res.render('testDetails');
});

router.get('/liveCode', (req, res) => {
    res.render('liveCode');
})

module.exports = router;