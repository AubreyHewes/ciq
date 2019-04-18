const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const sassMiddleware = require("node-sass-middleware");

const indexRouter = require("./routes/index");
const apiRoute = require("./routes/api");

const app = express();

const __DEV__ = process.env.NODE_ENV === "development";

if (!__DEV__) {
  app.use(helmet());
}
if (process.env.TRUST_PROXY) {
  app.set("trust proxy", process.env.TRUST_PROXY);
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger(__DEV__ ? "dev" : "combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", apiRoute);

app.use(cookieParser());

app.use(
  sassMiddleware({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true
  })
);

app.use("/", indexRouter);

app.use(express.static(path.join(__dirname, "public")));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
