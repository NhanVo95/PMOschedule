const express = require("express");
const router = express.Router();
const redis = require("../controllers/redis");

const db = require("../controllers/database");

/* GET home page. */
router.route("/studio").get(async function (req, res, next) {
  const sess = req.session;
  const query = req.query;

  var data = await db.getEvent("studio", query.month, query.approved);

  res.json(data);
});

router.route("/studio/list").get(async function (req, res, next) {
  const sess = req.session;
  const query = req.query;
  var data = {};

  const user = await redis.retrieveRedis(sess.userid);

  if (user.permission == "admin") {
    data = await db.getEventID("studio", "admin", query.month, query.approved);
  } else {
    data = await db.getEventID("studio", user.id, query.month, query.approved);
  }

  res.json(data);
});

router.route("/support").get(async function (req, res, next) {
  const sess = req.session;
  const query = req.query;

  var data = await db.getEvent("all", query.month, query.approved);
  res.json(data);
});

router.route("/support/list").get(async function (req, res, next) {
  const sess = req.session;
  const query = req.query;
  var data = {};

  const user = await redis.retrieveRedis(sess.userid);

  if (user.permission == "admin") {
    data = await db.getEventID("all", "admin", query.month, query.approved);
  } else {
    data = await db.getEventID("all", user.id, query.month, query.approved);
  }

  res.json(data);
});

router.route("/account").get(async function (req, res, next) {
  const sess = req.session;
  const query = req.query;
  var data = {};

  const user = await redis.retrieveRedis(sess.userid);

  if (user.permission == "admin") {
    data = await db.getAccount(query.role);
  }

  res.json(data);
});

router.route("/account/reset").get(async function (req, res, next) {
  const sess = req.session;
  const query = req.query;
  var data = {};

  const user = await redis.retrieveRedis(sess.userid);

  if (user.permission == "admin") {
    data = await db.updatePass(query.id, "");
  }

  res.redirect("/studio?p=account&n=all");
});

module.exports = router;
