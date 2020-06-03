const express = require('express');
const Question = require('../schemas/Question');
const responseHelpers = require('../helpers/response');
const secret = require('../config/secret');

const router = express.Router();
  
router.post('/add', async (req, res) => {
    console.log(req.body);
    const key = req.body.key;
    const questionText = req.body.question;
    const testCases = req.body.testCases;
    const shortCode = req.body.shortCode;
    const timer = req.body.timer;

    if (key !== secret.questionKey) {
        responseHelpers.failure(res, {
            message: "Please provide a valid key."
        });
        return;
    }
    
    if (shortCode !== null && shortCode !== undefined && shortCode.length < 5) {
        responseHelpers.failure(res, {
            message: "Please send a valid short code."
        });
        return;
    }

    const question = new Question({
        question: questionText,
        testCases: testCases,
        shortCode: shortCode,
        timer: timer
    });

    try {
        if (shortCode !== undefined && shortCode.length >= 5) {
            //Check if any other short code exists
            var result = await Question.findOne({shortCode: req.body.shortCode});

            if (result) {
                responseHelpers.failure(res, {
                    parameter: "shortCode",
                    message: "Question with similar short code already exists."
                });
                return;
            }
        }

        var doc = await question.save();
        console.log(doc);

        responseHelpers.success(res, {
            message: "Question saved successfully.",
            questionId: doc._id
        });
    } catch(e) {
        responseHelpers.failure(res, {
            message: "Unable to save question. Please try again."
        });
    }
});

router.get('/shortCode/:shortCode', (req, res) => {
    const shortCode = req.params.shortCode;

    if (shortCode === undefined
        || shortCode === null
        || shortCode.length === 0 ) {
        responseHelpers.failure(res, {
            message: "Please provide a vvvalid question ID"
        });
        return;
    }

    Question.findOne({shortCode: shortCode})
    .then(question => {
        if (question == null) {
            throw Error("Please provide a vvvvvalid question ID.");
        }
        responseHelpers.success(res, question);
    })
    .catch(err => {
        responseHelpers.failure(res, {
            message: "Please provide a vvvvvvvvalid question ID"
        });
    })
});

module.exports = router;