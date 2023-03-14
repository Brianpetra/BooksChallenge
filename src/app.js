const express = require('express');
const methodOverride = require('method-override')
const mainRouter = require('./routes/main');
const cookieParser = require("cookie-parser");
const userLoggedMiddleware = require('./middleware/userLoggedMiddleware')

const app = express();
const expressSession = require("express-session");

app.use(cookieParser());
app.use(expressSession({secret: "secret",resave: false,saveUninitialized: false}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'))
app.use(userLoggedMiddleware);

app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use('/', mainRouter);

app.listen(3000, () => {
  console.log('listening in http://localhost:3000');
});
