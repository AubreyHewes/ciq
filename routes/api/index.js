const createError = require("http-errors");
const express = require("express");
const router = express.Router();

const startTime = Math.round(new Date().getTime() / 1000);

const specification = require("./openapi.json");

router.get("/", (req, res) => {
  res.json({ version: 1.0, startTime, uptime: Math.round(new Date().getTime() / 1000 - startTime) });
});

router.get("/openapi.json", (req, res) => {
  res.json(specification);
});

router.use("/queue", require("./queue"));

// catch 404 and forward to error handler
router.use((req, res, next) => {
  next(createError(404));
});

// error handler
// TODO remove non production info in production
// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: "error",
    message: err.message
  });
});

module.exports = router;
