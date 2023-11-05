const express = require("express");
const router = express.Router();
const fs = require(`fs`);

/* GET home page. */
router.route("/").get(function (req, res, next) {
  // const sess = req.session;

  // if (!sess.name || !sess.userid || !sess.role) {
  //     res.redirect('/');
  // } else {

  // }
  const query = req.query;

  var file = "./public/pdf/" + query.p;

  fs.readFile(file, function (err, data) {
    res.contentType("application/pdf");
    res.send(data);
  });
});
module.exports = router;
