const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./routes');
const compilerRoutes = require('./routes/compilers');
const questionRoutes = require('./routes/questions');
const submissionsRoutes = require('./routes/submissions');
const userActivityRoutes = require('./routes/userActivity');
const exphbs  = require('express-handlebars');
const logger = require('morgan');
const helmet = require('helmet');
const db = require('./config/db');
const secretKey = require('./config/session');
const mongoose = require('mongoose');


const port = process.env.PORT || 8001;

mongoose.connect(db.url,function (err) {
  if(err)
  {
      console.log(err);
  }
  else{
      console.log("database connected successfully !")
  }
})
const app = express();


app.use(logger('dev')); //for logging requests in console which was made by users
app.use(helmet()); //securing our application




app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use(express.static(path.join(__dirname, 'ace-builds')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/', compilerRoutes);
app.use('/question', questionRoutes);
app.use('/submissions', submissionsRoutes);
app.use('/userActivity', userActivityRoutes);

app.get('/test', (req, res) => {
    res.sendFile(__dirname + '/test.html');
})


app.listen(port,function ()
{
    console.log('app is running on port '+port);
});

//Testing
module.exports = app;