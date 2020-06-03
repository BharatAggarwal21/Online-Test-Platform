var editor;
var currentSubmission;
var userActivity = {};

var userActivityMapping = {
    "run": "Code Run",
    "run_success": "Run Success",
    "run_failed": "Run Failed",
    "submit": "Code Submit",
    "submit_cancelled": "Code Submission Cancelled",
    "submit_failed": "Code Submission Failed",
    "time_up": "Time Up",
    "moved_away": "Moved Away"
};

var monthToStringMapping = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
}

$(document).ready(function () {
    /*
    Set the searchbar 'Enter' click event.
    Send request for submission when enter is pressed.
    */
    $("#searchbar").bind('keypress', function (event) {
        if (event.which == 13) {
            $("#run-button").hide();
            updateEditor('java', '');
            console.log('Sending Request');

            $("#searchbar").prop('disabled', true);
            $("#search-error").hide();
            $("#sidebar-content").hide();

            var promise = getShortCodeFetchPromise($("#searchbar").val());
            promise.then(response => response.json())
                .then(response => {
                    $("#searchbar").prop('disabled', false);
                    console.log(response);
                    if (response.response === 'success') {
                        $("#sidebar-content").show();
                        $("#sidebar-items").empty();

                        response.data.submissions.forEach((submission) => {
                            $("#sidebar-items").append(getSideBarElement(submission.userId, function () {
                                currentSubmission = submission;
                                $("#run-button").show();
                                $("#header-user-id").text($('.sidebar-item-selected').text());
                                updateEditor(submission.language,"");
                                let i=1;
                                while(i<=response.data.question.question.length){
                                $('#questionbutton'+i).click(function(){
                                    updateEditor(submission.language, submission.code[this.id.slice(-1)-1]);
                                })
                                i++;
                                }
                    
                                $("#header-code").trigger('click');
                                setUpDetails(currentSubmission._id);
                                //updateEditor(submission.language, submission.code[0]);
                                setLanguageName(submission.language);
                            }));
                        });
                        $("#question-text").text(response.data.question.question[0]);


        
                        var i=2;
                        while(i<=response.data.question.question.length)
                        {
                            var objTo = document.getElementById('questionswitchsubmission')
                            var divtest = document.createElement("div");
                            divtest.className="questiondivsubmission";
                            divtest.innerHTML = '<button id="questionbutton'+i+'">Question '+i+'</button>';
                            objTo.appendChild(divtest);
                            

                            var objTo = document.getElementById('questionshow')
                            var divtest = document.createElement("div");
                            divtest.innerHTML = '<p class="title">Question '+i+'</p>'+
                            '<p class="text" id="question-text'+i+'"></p>';
                            objTo.appendChild(divtest);
                            $("#question-text"+i).text(response.data.question.question[i-1]);
                            i++;
                        }
                        $("#time-text").text(`${response.data.question.timer} minutes`);
                    } else {
                        $("#search-error").show()
                            .text(response.data.message);
                    }
                })
                .catch(err => {
                    $("#searchbar").prop('disabled', false);
                    $("#search-error").show()
                        .text("Unable to get test details. Please try again.");
                })
        }
    });

    /*
    Toggle the Submission/Question pannel
    */
    $("#option-submissions, #option-question").click(function () {
        $(".options-container .active").removeClass('active');
        $(this).addClass('active');

        if ($(this).attr('id') === 'option-submissions') {
            $("#sidebar-items").show();
            $("#question-details").hide();
        } else if ($(this).attr('id') === 'option-question') {
            $("#sidebar-items").hide();
            $("#question-details").show();
        }
    });

    /*
    Toggle the Code/Details pannel
    */
    $("#header-code, #header-details").click(function () {
        $(".header .active").removeClass('active');
        $(this).addClass('active');

        if ($(this).attr('id') === 'header-details') {
            $("#editor").hide();
            $("#details").show();
        } else if ($(this).attr('id') === 'header-code') {
            $("#editor").show();
            $("#details").hide();
        }
    });

    /*
    Compile the code when run button is clicked
    */
    $("#run-button").click(function () {
        $(this).prop('disabled', true);
        getCompilePromise(
            editor.session.getValue(),
            currentSubmission.language
        ).then(result => {return result.json();})
            .then(result => {
                console.log("________________________");
                console.log(result);
                $("#compilation-error").hide();
                $(this).prop('disabled', false);

                if (result.response === "success") {
                    $("#code-result").text(result.data.stdout);
                    console.log(result.data.stdout);
                } else {
                    $("#compilation-error").show();
                    $("#code-result").text(result.data.stderr);
                    console.log(result.data.stderr);
                }

                $("#code-output").css({
                    'width': '400',
                });
            })
            .catch(err => {
                $(this).prop('disabled', false);
                console.log(err);
            });
    });

    /*
    Close the code out sidebar(right)
    */
   $("#close-code-output").click(function() {
       $("#code-output").css('width', 0);
   });

    setUpEditor();
});

function setUpDetails(id) {
    if (userActivity[id] !== undefined) {
        console.log("Data already present!", userActivity[id]);
        updateDetailsUI(userActivity[id]);
        return;
    }

    console.log(userActivity);
    console.log('Data not present, Fetching it!');

    getUserActivityPromise(id)
    .then(response => response.json())
    .then(response => {
        console.log(response);
        if (response.response === 'success') {
            //Cache the data
            userActivity[id] = response.data.userActivity;

            //Show the result
            if (currentSubmission._id === id) {
                updateDetailsUI(userActivity[id]);
            }
        } else {

        }
    })
    .catch(err => {
        console.log(err);
        if (currentSubmission._id === id) {
            
        }
    })
}

function getUserActivityPromise(id) {
    return fetch(`/userActivity/${id}`);
}

function updateDetailsUI(userActivities) {
    $("#user-activity-details").empty();
    userActivities.forEach(activity => {
        $("#user-activity-details").append(getUserActivityDetailElement(activity))
    });
}

function getSideBarElement(userId, onClickCallback) {
    var template = `<p class="user-id">${userId}</p>`;

    //Create element
    var div = $(document.createElement('div'));
    div.addClass('sidebar-item');
    div.html(template);
    div.attr('onClick', 'return false;');

    div.click(function () {
        $(".sidebar-item-selected").removeClass('sidebar-item-selected');
        div.addClass('sidebar-item-selected');
        onClickCallback();
    });
    return div;
}

function getUserActivityDetailElement(activity) {
    var template = `<div class="line"></div>
                    <div class="dot-circle"></div>
                    <div class="line-horizontal"></div>
                    <div class="user-activity">
                    <div class="item-block">
                        <p class="activity-title">Activity Type</p>
                        <p class="activity-content">${getActivityType(activity.activityType)}</p>
                    </div>
                    <div class="item-block time-block">
                        <p class="activity-title">Time On Timer</p>
                        <p class="activity-content">${activity.timeOnTimer}</p>
                    </div>
                    <p class="activity-time">${getFormattedDate(activity.time)}</p>
                </div>`;

    var div = $(document.createElement('div'));
    div.addClass('user-activity-container');
    div.html(template);

    return div;
}

function getActivityType(type) {
    return userActivityMapping[type];
}

function getFormattedDate(time) {
    var date = new Date(time);
    var month = monthToStringMapping[date.getMonth() + 1];
    var day = date.getDate();
    var year = date.getFullYear();
    var minute = date.getMinutes();
    var hour = date.getHours();
    var seconds = date.getSeconds();

    return `${day} ${month} ${year} ${hour}:${minute}:${seconds}`;
}

function getShortCodeFetchPromise(shortCode) {
    return fetch(`/submissions/getSubmissions/${shortCode}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

function setUpEditor() {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/crimson_editor");
    editor.setReadOnly(false);
    editor.onPaste = function () { return ""; };
    editor.setOptions({
        fontSize: "14px"
    });
}

function updateEditor(mode = 'text', code = '') {
    if (mode === 'c++') {
        mode = 'c_cpp';
    }
    editor.session.setMode("ace/mode/" + mode);
    editor.session.setValue(code);
}

function getCompilePromise(code, language) {
    return fetch('/compile', {
        method: "post",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            language,
            code
        })
    })
}

function setLanguageName(language) {
    var fullName = 'Test Dashboard';
    if (language === 'java') {
        fullName = 'Java';   
    } else if (language === 'python') {
        fullName = 'Python';
    } else if (language === 'c++') {
        fullName = 'C++';
    }

    $("#language-name").text(fullName);
}