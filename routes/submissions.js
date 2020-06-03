const router = require('express').Router();
const CodeSubmit = require('../schemas/CodeSubmit');
const Question = require('../schemas/Question');
const responseHandlers = require('../helpers/response');

router.get('/getSubmissions/:shortCode', async (req, res) => {
    const shortCode = req.params.shortCode;
    console.log(`Request received: ${shortCode}`);
  
    if (shortCode === null
    || shortCode === undefined) {
        responseHandlers.failure(res, {
            parameter: "shortCode",
            message: "Invalid test code."
        });
        return;
    }

    try {
        const question = await Question.findOne({shortCode});

        if (question == null) {
            responseHandlers.failure(res, {
                parameter: "shortCode",
                message: "Invalid test code."
            }); 
            return;
        }

        const questionId = question._id;

        const cursor = CodeSubmit.find({questionId}).cursor();

        const docs = [];

        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
            docs.push(doc);
        }

        responseHandlers.success(res, {
            question,
            submissions: docs
        });
    } catch (e) {
        console.log(e);
        responseHandlers.failure(res, {
            message: "Unable to get details. Please try again."
        });
    }

    console.log(`Request End: ${shortCode}`);
});

module.exports = router;