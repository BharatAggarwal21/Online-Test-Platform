var selectedLanguage = 'java';
var javaIntroCode = "//Don't change the name of class\n" +
"class OnlineCompileJava {\n" +
"    public static void main(String args[]) {\n" +
"        System.out.println(\"Hello World\");\n" + 
"        //Enter your code here\n" +
"    }\n" + 
"}\n";
var pythonIntro = "print(\"Hello World\")"
var editorarray=[]
var editor;
var languageMode;
var lenofdata=0;
//Firebase
var database;
var messageReference;
var messageKeys = new Set();

var totalTime = 60000;
var endTime;
var enrollmentNumber = "test-id";
var timerInterval;

//Track the activity of user.
var userActivity = [];
var userActivityType = {
    run: "run",
    runSuccess: "run_success",
    runFailed: "run_failed",
    submit: "submit",
    submitCancelled: "submit_cancelled",
    submitFailed: "submit_failed",
    timeUp: "time_up",
    movedAway: "moved_away"
};

$(document).ready(function() {
    $(window).blur(function() {
        addUserActivity(userActivityType.movedAway);
    });
    if (isFromEdsonet) {
        setUpFromEdsonet();
    } else {
        console.log(typeof timer);
        if (timer !== undefined && typeof timer === "number") {
            totalTime = timer * 60 * 1000;
        }
    }

    initTimerText();

    $("#questionbutton1").click(function(){
        $('#container2').hide();
        $('#container3').hide();
        $('#container4').hide();
        $('#container8').hide();
        $('#container9').hide();
        $('#container10').hide();
        $('#container5').hide();
        $('#container6').hide();
        $('#container7').hide();
        $('#container1').show();
    });
    
    var run = document.getElementById("run-button");

    run.addEventListener('click', function(event) {
        addUserActivity(userActivityType.run);

        $("#loading-image").css("display", "inline");
        $("#run-button").css({
            "background-color": "grey"
        });
        var code = editorarray[0].getValue();
        var bodyData = {
            language: selectedLanguage,
            code: code
        };
        fetch('/compile', {
            method: "post",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                language: selectedLanguage,
                code
            })
        })
        .then(result => result.json())
        .then(result => {
            $("#loading-image").css("display", "none");
            $("#run-button").css({
                "background-color": "seagreen"
            });

            console.log(result);
            if (result.response === "success") {
                addUserActivity(userActivityType.runSuccess, result.data.stdout);
                $("#output-text").text(result.data.stdout);
                console.log(result.data.stdout);
            } else {
                addUserActivity(userActivityType.runFailed, result.data.stderr);
                $("#output-text").text(result.data.stderr);
                console.log(result.data.stdout);
            }
            $("#run-button").css({
                "background-color": "#990011FF"
            });
        })
        .catch(err => {
            addUserActivity(userActivityType.runFailed);
            console.log(err);
        });
    });

    $("#select-prog-close").click(function() {
        $("#language-select-popup").css("display", "none");
    });

    $("#language-select-btn").click(function() {
        var element = document.querySelector("input[name='language']:checked");
        if (element !== null || element !== undefined) {
            selectedLanguage = element.value;
            console.log("Language selected: " + selectedLanguage);

            if (selectedLanguage === 'c++') {
                languageMode = "c_cpp";
                $("#language-name1").text("C++");
            } else if (selectedLanguage === 'python') {
                $("#editor1").html(pythonIntro);
                languageMode = "python";
                $("#language-name1").text("Python");
            } else if (selectedLanguage === 'java') {
                $("#editor1").html(javaIntroCode);
                $("#language-name1").text("Java");
                languageMode = "java";
            }
            
            //Disable paste
            editor = ace.edit("editor1");
            editor.setTheme("ace/theme/crimson_editor");
            editor.session.setMode("ace/mode/" + languageMode);
            editor.onPaste = function() {return "";};
            
            editorarray.push(editor);
            let i=2;
            while(i<=lenofdata){
                if (selectedLanguage === 'c++') {
                    languageMode = "c_cpp";
                    $("#language-name"+i).text("C++");
                } else if (selectedLanguage === 'python') {
                    $("#editor"+i).html(pythonIntro);
                    languageMode = "python";
                    $("#language-name"+i).text("Python");
                } else if (selectedLanguage === 'java') {
                    $("#editor"+i).html(javaIntroCode);
                    $("#language-name"+i).text("Java");
                    languageMode = "java";
                }
                
                //Disable paste
                var editor = ace.edit("editor"+i);
                editor.setTheme("ace/theme/crimson_editor");
                editor.session.setMode("ace/mode/" + languageMode);
                editor.onPaste = function() {return "";};
               
                editorarray.push(editor);

                var run = document.getElementById("run-button"+i);

                run.addEventListener('click', function(event) {
                    addUserActivity(userActivityType.run);

                    $("#loading-image"+this.id.slice(-1)).css("display", "inline");
                    $("#run-button"+this.id.slice(-1)).css({
                    "background-color": "grey"
                     }); 
                    var code = editorarray[this.id.slice(-1)-1].getValue();
                    var bodyData = {
                    language: selectedLanguage,
                    code: code
                    };
                    fetch('/compile', {
                    method: "post",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                    language: selectedLanguage,
                    code
                    })
                    })
                    .then(result => result.json())
                    .then(result => {
                    $("#loading-image"+this.id.slice(-1)).css("display", "none");
                    $("#run-button"+this.id.slice(-1)).css({
                    "background-color": "seagreen"
                    });

                    console.log(result);
                    if (result.response === "success") {
                    addUserActivity(userActivityType.runSuccess, result.data.stdout);
                    $("#output-text"+this.id.slice(-1)).text(result.data.stdout);
                    console.log(result.data.stdout);
                    } else {
                    addUserActivity(userActivityType.runFailed, result.data.stderr);
                    $("#output-text"+this.id.slice(-1)).text(result.data.stderr);
                    console.log(result.data.stdout);
                    }
                    $("#run-button"+this.id.slice(-1)).css({
                        "background-color": "#990011FF"
                        });
                    })
                    .catch(err => {
                    addUserActivity(userActivityType.runFailed);
                    console.log(err);
                });
            });

                i++;
            }
            
            $("#language-select-popup").css("display", "none");

            enableDragging();
            startTimer(1);
            //updateFirebase();
        }
    });

    $("#timeup-submit-code-btn").click(function() {
        $(this).hide();
        $("#code-submit-info").css("color", "black")
            .text("Submitting code. Please wait...")
            .show();

        getCodeSubmitPromise()
            .then(response => response.json())
            .then(response => {
                if (response.response === 'success') {
                    $("#code-submit-info").text(response.data.message + "\nPlease close the window.");
                } else {
                    addUserActivity(userActivityType.submitFailed);
                    $(this).show();
                    $("#code-submit-info").css("color", "red")
                        .text("Code submission failed! Please try again.")
                        .show();
                }
            })
            .catch(err => {
                addUserActivity(userActivityType.submitFailed);
                $(this).show();
                $("#code-submit-info").css("color", "red")
                    .text("Code submission failed! Please try again.")
                    .show();
            });
    });

    $("#test-details-submit-btn").click(function() {
        if (isFromEdsonet) {
            enrollmentNumber = $("#enrollment-number").val();
            $("#test-details-popup").hide();
            //setUpFirebaseDatabase();
        } else {
            var testDetailsInfo = $("#test-details-info");
            testDetailsInfo.hide();

            enrollmentNumber = $("#enrollment-number").val();
            var testId = $("#test-id").val();

            if (enrollmentNumber.length < 8) {
                testDetailsInfo.css("color", "red")
                .text("Please enter a valid enrollment number")
                .show();
                return;
            }

            if (testId.length < 4) {
                testDetailsInfo.css("color", "red")
                .text("Please enter a valid test id.")
                .show();
                return;
            }
            
            $(this).hide();
            testDetailsInfo.css("color", "black")
                .text("Fetching test details. Please Wait...")
                .show();

            getTestDetailsPromise(testId)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                if (response.response === "failure") {
                    throw Error("Invalid test ID.");
                } else {
                    totalTime = Number(response.data.timer) * 60 * 1000;

                    var count = 2;
                    $("#question1").text(response.data.question[0]);
                    lenofdata=response.data.question.length;
                    while(count<=response.data.question.length){
                    var objTo = document.getElementById('questionswitch')
                    var divtest = document.createElement("div");
                    divtest.className="questiondiv";
                    divtest.innerHTML = '<button id="questionbutton'+count+'">Question '+count+'</button>';
                    objTo.appendChild(divtest)
                    //question.push($("#question"+i).val());
                    var objT = document.getElementById('questionswitchcompiler')
                    var divtes = document.createElement("div");
                    divtes.innerHTML = '<div id="container'+count+'" class="clearfix'+count+'">'+
                    '<div id="editor'+count+'"></div>'+
            
                    '<div id="dragbar'+count+'"></div>'+
            
                    '<div id="result">'+
                        '<div id="toolbar">'+
                            '<pre class="question" id="question'+count+'">{{question'+count+'}}</pre>'+
                            '<p class="h-divider"></p>'+
                            '<p class="toolbar-text" id="language-name'+count+'">Language</p>'+
                            '<p id="run-button'+count+'" class="toolbar-button">Run</p>'+
                            '<p id="timer-text'+count+'" class="toolbar-text">0:0:0</p>'+
                            '<p id="submit-button'+count+'" class="toolbar-button">Submit</p>'+
                            '<img src="images/gear_loading.gif" style="width: 30px; height: 30px; vertical-align: middle; display: none" id="loading-image'+count+'">'+
                        '</div>'+
            
                        '<div id="output">'+
                            '<pre id="output-text'+count+'" class="output-text">Output will be shown here.</pre>'+
                        '</div>'+
                        '</div>'+
                    '</div>';
                    objT.appendChild(divtes)
                    
                    $("#question"+count).text(response.data.question[count-1]);
                    $("#questionbutton"+count).click(function(){
                        var j=1;
                        while(j<=lenofdata)
                        {
                            if(j!=this.id.slice(-1)){
                            $('#container'+j).hide();}
                            j++;
                        }
                        $('#container'+this.id.slice(-1)).show();
                    });
                    
                    $("#submit-button"+count).click(function() {
                        $("#submit-code-popup").show();
                    });
                    
                    console.log("done loop");
                    //Disable paste
                    startTimer(count);
                
                    count++;
                    }
                    
                    questionId = response.data._id;
                   
                    $("#test-details-popup").hide();
                    //setUpFirebaseDatabase();
                }
            })
            .catch(err => {
                $(this).show();
                testDetailsInfo.css("color", "red")
                    .text("Invalid test id.hahah Please enter a correct test id.")
                    .show();
            });
        }
    });

    $("#submit-code-btn").click(function() {
        addUserActivity(userActivityType.submit);
        $("#submit-code-controls").hide();

        $("#submit-code-info").css("color", "black")
            .text("Submitting code. Please wait...")
            .show();

        getCodeSubmitPromise()
            .then(response => response.json())
            .then(response => {
                console.log(response);
                if (response.response === 'success') {
                    $("#submit-code-info").text(response.data.message + "\nPlease close the window.");
                    clearInterval(timerInterval);
                } else {
                    $("#submit-code-controls").show();
                    $("#submit-code-info").css("color", "red")
                        .text("Code submission failed! Please try again.")
                        .show();
                }
            })
            .catch(err => {
                addUserActivity(userActivityType.submitFailed);
                $("#submit-code-controls").show();
                $("#submit-code-info").css("color", "red")
                    .text("Code submission failed! Please try again.")
                    .show();
            });
    });

    $("#submit-code-cancel-btn").click(function() {
        addUserActivity(userActivityType.submitCancelled);
        $("#submit-code-popup").hide();
    });

    $("#submit-button").click(function() {
        $("#submit-code-popup").show();
    });

    $("#send-btn").click(function() {
        var message = $("#message-text").val();
        if (message.length === 0) {
            return;
        }

        sendMessage(message);
        $("#message-text").val("");
    });

    $("#messages-button").click(function() {
        $("#message-board").css({
            'width': '30%',
        });
        $("#message-box").css({
            'top': '+=1px',
            'top': '-=1px'
        });
    });

    $("#message-close").click(function(){
        $("#message-board").css({
            'width': '0',
        });
        $("#message-box").css({
            'top': '+=1px',
            'top': '-=1px'
        });
    });
});

function setUpFromEdsonet() {
    enrollmentNumber = userId;
    totalTime = timer * 60 * 1000;
    $("#test-id").hide();
    $("#test-id-title").hide();
}

function setUpFirebaseDatabase() {
    database = firebase.database().ref('coding/' + enrollmentNumber);
    messageReference = firebase.database().ref(`messages/${enrollmentNumber}`);
    messageReference.remove();
    messageReference.update({
        '14103093': {
            message: `Hi, Welcome! I am solving the question:\n ${$("#question").text()}`,
            time: new Date().getTime()
        }
    });
    addMessageListener();
}

function updateFirebase() {
    database.set({
        code: editor.getValue(),
        language: selectedLanguage,
        question: $("#question").text(),
        cursorPosition: editor.getCursorPosition()
    });
}

function getCodeSubmitPromise() {
    var codes=[];
    let i=1;
    while(i<=editorarray.length)
    {
        codes.push(editorarray[i-1].getValue());
        i++;
    }
    return fetch('/submit', {
        method: "POST",
        headers: {'Content-Type': "application/json"},
        body: JSON.stringify({
            code: codes,
            language: selectedLanguage,
            questionId: questionId,
            userId: enrollmentNumber,
            timeOnTimer: getFormattedTime(endTime - new Date().getTime()),
            submissionTime: new Date().getTime(),
            userActivity
        })
    });
}

function getTestDetailsPromise(shortCode) {
    return fetch(`/question/shortCode/${shortCode}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    });
}

function startTimer(x) {
    endTime = new Date().getTime() + totalTime;
    //Timer code
    timerInterval = setInterval(function() {
        var now = new Date().getTime();
        var timeDifference = endTime - now;

        var hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        $("#timer-text"+x).text(getFormattedTime(timeDifference));
        if (now > endTime) {
            addUserActivity(userActivityType.timeUp);
            clearInterval(timerInterval);
            $("#timer-text").text("Time up!");
            $("#submit-code-popup").hide();
            showTimeUpPopUp();
        }
    }, 1000);
}

function getFormattedTime(time) {
    if (time <= 0) {
        return "0:0:0";
    }

    var hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((time % (1000 * 60)) / 1000);
    return `${hours}:${minutes}:${seconds}`
}

function initTimerText() {
    $("#timer-text").text(getFormattedTime(totalTime));
}

function showTimeUpPopUp() {
    $("#timeup-popup").css("display", "block");
}

function enableDragging() {
    var i = 0;
var dragging = false;
   $('#dragbar').mousedown(function(e){
       e.preventDefault();
       
       dragging = true;
       var main = $('#result');
       var ghostbar = $('<div>',
                        {id:'ghostbar',
                         css: {
                                height: main.outerHeight(),
                                top: main.offset().top,
                                left: main.offset().left
                               }
                        }).appendTo('body');
       
        $(document).mousemove(function(e){
          ghostbar.css("left",e.pageX+2);
       });
       
    });

   $(document).mouseup(function(e){
       if (dragging) 
       {
           var percentage = (e.pageX / window.innerWidth) * 100;
           var mainPercentage = 100-percentage;
           
          // $('#console').text("side:" + percentage + " main:" + mainPercentage);
           
           $('#editor').css("width",percentage + "%");
           $('#result').css("width",mainPercentage + "%");
           $('#ghostbar').remove();
           $(document).unbind('mousemove');
           dragging = false;
       }
    });
}

function addUserActivity(
    activityType, 
    message = ""
) {

    if (questionId === undefined 
        || questionId === '' ) {
        return
    }
    userActivity.push({
        questionId,
        userId: enrollmentNumber,
        timeOnTimer: getFormattedTime(endTime - new Date().getTime()),
        activityType,
        time: new Date().getTime(),
        message
    });
}

function sendMessage(message) {
    var newPostKey = messageReference.push().key;
    console.log("Key", newPostKey);
    var time = new Date().getTime();
    messageReference.update({[newPostKey]: {
        message,
        time
    }});
}

function updateMessages(keys, messages) {
    if (messages === undefined || messages === null) return null;
    keys.forEach(function(key) {
        messageKeys.add(key);
        $("#messages").append(getMessageElement(messages[key]));
    });
    scrollChatToBottom();
}

function addMessage(message) {
    $("#messages").append(getMessageElement(message));
    scrollChatToBottom();
}

function getMessageElement(data) {
    var template = `<p class="message">${data.message}</p>
    <p class="time">${formatTime(data.time)}</p>`

    var div = $(document.createElement("div"));
    div.addClass('message-item');
    div.html(template);
    return div;
}

function formatTime(time) {
    var date = new Date(time);
    var minute = date.getMinutes();
    var hour = date.getHours();
    var seconds = date.getSeconds();

    return `${hour}:${minute}`;
}

function scrollChatToBottom() {
    var div = document.getElementById("messages");
    div.scrollTop = div.scrollHeight;
}

function addMessageListener() {
    messageReference.once('value', function(snapshot) {
        console.log("Once");
        updateMessages(Object.keys(snapshot.val()), snapshot.val());
        messageReference.on('child_added', function(message) {
            if (!messageKeys.has(message.key)) {
                addMessage(message.val());
            }
        });
    });
}