function success(res, data) {
    console.log('successsss');
    console.log(data);
    res.json({
        name:"bharat",
        response: "success",
        data
    });
}

function failure(res, data) {
    res.status(200).json({
        response: "failure",
        data
    });
}

module.exports = {
    success: success,
    failure: failure
}