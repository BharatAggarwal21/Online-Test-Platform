$(window).ready(function() {
    $(".error").hide();
    $("#loader").hide();
    $(".details").hide();

    var count = 1;
    $("#more_fields").click(function() {
    count++;
    var objTo = document.getElementById('inputtextboxes')
    var divtest = document.createElement("div");
    divtest.innerHTML = '<div id="question-text-container" class="input-container"><label class="label">Coding Question '+count+'</label><p class="description">The question that is required to be solve by the user.</p><textarea class="text-area" id="question'+count+'"></textarea><p class="error" id="question-error"></p></div>';
    
    objTo.appendChild(divtest)
    });
    var i=1;
    var question = [];
    var shortCode = $("#short-code");
    var timer = $("#timer");

    $("#create-code-btn").click(function() {
        $(".error").hide();
        while(i<=count)
        {
        question.push($("#question"+i).val());
        i++;
        }
        if (shortCode.val().length < 5) {
            $("#short-code-error").text("Short code must be of minimum 5 chars.")
                .show();
            return;
        }

        if (timer.val() === 'Select') {
            $("#timer-error").text("Please select a time.")
                .show();
            return;
        }

        $(this).prop('disabled', true);
        $("#loader").show();

        getCreateQuestionPromise(
            question,
            shortCode.val(),
            timer.val()
        ).then(response => response.json())
        .then(response => {
            $(this).prop('disabled', false);
            $("#loader").hide();

            if (response.response === 'success') {
                $("#question-form").slideUp(500, function() {
                    $("#details-short-code").text(shortCode.val());
                        $("#details").show();
                });
            } else {
                if (response.data.parameter === 'shortCode') {
                    $("#short-code-error").text(response.data.message)
                        .show();
                } else {
                    $("#submit-error").text(response.data.message)
                        .show();
                }
            }
        })
        .catch(err => {
            console.log(err);
            $(this).prop('disabled', false);
            $("#loader").hide();
            $("#submit-error").text("Unable to create test. Please try again!")
                        .show();
        })
    });
});

function getCreateQuestionPromise(question, shortCode, timer) {
    return fetch('/question/add', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            question,
            shortCode,
            timer,
            testCases: [],
            key: '9uM(Z#YTR*&#&*Q@&T$*&Q#(*'
        })
    });
}