const createError = require("http-errors");
const express = require("express");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");

var debug = require("debug")("pmo:server");

const fs = require("fs");
const pdfPath = "./public/pdf";

fs.access(pdfPath, (error) => {
  // To check if the given directory
  // already exists or not
  if (error) {
    // If current directory does not exist
    // then create it
    fs.mkdir(pdfPath, (error) => {
      if (error) {
        debug(error);
      } else {
        debug("New Directory created successfully !!");
      }
    });
  } else {
    debug("Given Directory already exists !!");
  }
});

var db = require("./controllers/database");
var dbinit = require("./controllers/dbinit");

// NOTE - Connect database and initialize the database
db.connect();
// db.backupTask("59 23 * * *");

dbinit.dbinit();
// NOTE - Delete this account when done Dev stage
dbinit.dbinittest();

const redis = require("./controllers/redis");

redis.connectRedis();

var app = express();

// SECTION - Initialize database session
var sess = {
  secret: "PMO_HCMUTE",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // if true only transmit cookie over https
    httpOnly: false, // if true prevent client side JS from reading the cookie
    maxAge: 1000 * 60 * 60 * 24, // session max age in miliseconds
  },
};

app.use(session(sess));
// !SECTION - Initialize database session

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/css",
  express.static(path.join(__dirname, "/node_modules/mdb-ui-kit/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "/node_modules/mdb-ui-kit/js"))
);

//SECTION - Set up routes
const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");
const viewRouter = require("./routes/view");
const loginRouter = require("./routes/login");
const studioRouter = require("./routes/studio");
const supportRouter = require("./routes/support");
const bandrollRouter = require("./routes/bandroll");
const testRouter = require("./routes/testUI");

app.use("/", indexRouter);
app.use("/api", apiRouter);
app.use("/view", viewRouter);
app.use("/login", loginRouter);
app.use("/studio", studioRouter);
app.use("/support", supportRouter);
app.use("/bandroll", bandrollRouter);
app.use("/test", testRouter);
//!SECTION - Set up routes

//SECTION - Set up error handler
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
//!SECTION - Set up error handler

module.exports = app;
