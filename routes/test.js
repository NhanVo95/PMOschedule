const express = require("express");
const router = express.Router();

const title = "Test";
const link = "/studio";

/* GET home page. */
router.route("/").get(async function (req, res, next) {
  res.render("test");
});
// .post(async function (req, res, next) {});

module.exports = router;
