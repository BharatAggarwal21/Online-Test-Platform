const router = require('express').Router();
const UserActivity = require('../schemas/UserActivity');
const responseHandlers = require('../helpers/response');

router.get('/:codeSubmitId', async (req, res) => {
    const codeSubmitId = req.params.codeSubmitId;
 
    if (codeSubmitId === undefined 
    || codeSubmitId === null) {
        responseHandlers.failure(res, {
            message: "Please provide an Id to fetch activity for."
        });
        return;
    }

    try {
        const userActivity = await UserActivity.find({codeSubmitId});

        responseHandlers.success(res, {
            userActivity
        });
    } catch(e) {
        console.log(e);
        responseHandlers.failure(res, {
            message: "Unable to get details, Please try again."
        });
    }
});

module.exports = router;