const createError = require("http-errors");
const express = require("express");
const router = express.Router();
const QueueManager = require("../../../lib/QueueManager");

const queue = new QueueManager({
  storeUrl: process.env.REDIS_URL || process.env.MEMCACHED_URL,
});

const hasValidReadAccessToken = req => {
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  return false;
};

const hasValidUpstreamWriteAccess = req => {
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  const token = req.query.token || req.headers["x-api-token"];
  if (!token || !(req.body.upstream && req.body.upstream.service)) {
    return false;
  }

  // TODO sanitize
  const upstreamService = req.body.upstream.service.toUpperCase();

  return [
    process.env[`UPSTREAM_${upstreamService}_ACCESS_TOKEN`],
    process.env[`${upstreamService}_ACCESS_TOKEN`],
    process.env.ACCESS_TOKEN
  ]
    .filter(v => !!v)
    .reduce((c, possibleToken) => {
      if (token === possibleToken) {
        c = true;
      }
      return c;
    }, false);
};

router.get("/:queueId?", (req, res, next) => {
  if (!hasValidReadAccessToken(req)) {
    next(createError("Unauthorized", 401));
    return;
  }
  if (req.params.queueId) {
    res.json({});
    return;
  }
  res.json([]);
});

router.post(
  "/",
  (req, res, next) => {
    if (!hasValidUpstreamWriteAccess(req)) {
      next(createError("Unauthorized", 401));
      return;
    }
    queue.add(req.body);
    next();
  },
  (req, res) => {
    res.json({ yo: true });
  }
);

module.exports = router;
