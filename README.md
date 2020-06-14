# Online-test-platform
This project aims to create a online platform which can be converted into a product in near future catering to the needs of corporate and colleges alike for conducting centralised tests and evaluation various languages.

The project works in the following sequence:

1. Admin creates a test using a test id and sets a time limit for the test.

2. The client enters his details on his browser window and gets access to the test using the unique test id. He then gets the option to choose the language of his interest in which he will code. Once he chooses the language the test timer starts and he is directed to the editor window.

3. Once inside the test window, the client can run the code that he has typed, submit it for evaluation or message the admin if he has any query. The client can not copy-paste code inside the editor as the copying and pasting permissions inside the editor have been disabled.

4. Once the client submits the code for evaluation a copy of the entire code is saved in the database with the language extension for further review by the invigilator.

5. On the admins end, he can view all the submissions based on the test id and from the list of
submissions can evaluate individual submissions.

6. The admin can even run the program in a separate output window on his/her own screen. To ensure that the client has not cheated in his test, we have tried to incorporate a activity details board using event handlers from the client window. The activity details board can help the faculty in determining if the code was duplicated and this feature is a considerable upgrade from any existing
systems as it optimizes the test process by providing a way to track user activity.

7. Moreover, we implemented the functionality of adding multiple questions in a single text . The admin can multiple question to a student’s test which the student is required to complete in the given time frame.
The platform includes Python, Java and C++ for now but will be expanded to more languages as part of future work. The project is also to be optimized for redundant functions as a part of restructuring and refactoring the code to follow healthy programming practices.

Npm : npm init
It is used to install share and distribute code; manage dependencies of used modules in project.
Ace builds : npm i ace-builds
Ace is a code editor written in JavaScript. It stands for Ajax.org cloud9 editor.
Express handlebar : npm i express-handlebars
It exports a function which can be invoked with no arguments and it will return a function which can be registered with an Express app.
Mongoose : npm i mongoose
Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
