const express          = require('express');
const mustacheExpress  = require('mustache-express');
const bodyParser       = require('body-parser');
const expressValidator = require('express-validator');
const path             = require('path');
const morgan           = require('morgan');
const loginRoutes      = require('./routes/login.js');
const signupRoutes      = require('./routes/signup.js');
const mongoose         = require('mongoose');
const session          = require('express-session');
const app              = express();

// Morgan to log router activity
if (app.get('env') == 'production') {
  app.use(morgan('common', {
    skip: function(req, res) {
      return res.statusCode < 400
    },
    stream: __dirname + '/../morgan.log'
  }));
} else {
  app.use(morgan('dev'));
};

// MongoDB access
const nodeEnv = process.env.NODE_ENV || "development";
const config = require("./config.json")[nodeEnv];
mongoose.connect(config.mongoURL);
// Set Port
app.set('port', (process.env.PORT || 3000));
// Serve static files to server
app.use(express.static(path.join(__dirname, "public")));
// Setting up View Engine
app.engine("mustache", mustacheExpress());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");
// Body parser and validator implementation
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
app.use(session({
  secret: 'shh hhh shhh',
  resave: true,
  saveUninitialized:true
}));
// Routes
app.use(loginRoutes);
app.use(signupRoutes);
// Open Port
//if (require.main === "module") {
  app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });
//};

module.exports = app;
