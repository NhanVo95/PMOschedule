const express = require("express");
const router = express.Router();

const redis = require("../controllers/redis");

const crypto = require("crypto");

const db = require("../controllers/database");

/* GET home page. */
router
  .route("/")
  .get(async function (req, res, next) {
    const sess = req.session;
    const query = req.query;

    const result = await redis.retrieveRedis(sess.userid);

    if (!sess.userid || !result) {
      res.render("login", {
        email: "",
        data: "",
        redirect: query.redirect,
        site: "login",
      });
    } else {
      res.redirect(query.redirect);
    }
  })
  .post(async function (req, res, next) {
    const { email, password, redirect } = req.body;

    var result = await db.checkPass("email", email, password);

    if (!result.name) {
      res.render("login", {
        email: "",
        data: "Tài khoản không tồn tại",
        site: "login",
      });
    } else if (result.checked == true) {
      const randomID = crypto.randomBytes(16).toString("hex");

      delete result["checked"];

      redis.storeRedis(randomID, result);

      req.session.userid = randomID;

      res.redirect(redirect);
    } else {
      res.render("login", {
        email: email,
        data: "Mật khẩu không chính xác",
        site: "login",
      });
    }
  });

router.route("/out").get(function (req, res, next) {
  const sess = req.session;
  const query = req.query;

  try {
    sess.destroy();
  } catch (error) {
    console.log(error);
  }

  if (!query.redirect) {
    res.redirect("/");
  } else {
    res.redirect("/" + query.redirect);
  }
});

router
  .route("/change")
  .get(async function (req, res, next) {
    const sess = req.session;
    const query = req.query;

    const user = await redis.retrieveRedis(sess.userid);

    if (!sess.userid || !(user.length != 2)) {
      res.redirect(query.redirect);
    } else {
      res.render("login", {
        email: "",
        data: "",
        site: "changepass",
      });
    }
  })
  .post(async function (req, res, next) {
    const sess = req.session;
    const { oldPassword, newPassword, retypePassword } = req.body;

    const user = await redis.retrieveRedis(sess.userid);

    if (!sess.userid || !(user.length != 2)) {
      res.redirect(query.redirect);
    } else {
      var result = await db.checkPass("id", user.userid, oldPassword);

      if (!result.checked) {
        res.render("login", {
          email: "",
          data: "Mật khẩu cũ không đúng",
          site: "changepass",
        });
      } else {
        if (newPassword == retypePassword) {
          db.updatePass(user.userid, newPassword);

          res.redirect(query.redirect);
        } else {
          res.render("login", {
            email: "",
            data: "Mật khẩu nhập lại không khớp",
            site: "changepass",
          });
        }
      }
    }

    if (!sess.name || !sess.userid || !sess.permission) {
      if (JSON.stringify(req.headers.referer).search("grandhall") >= 0) {
        res.redirect("/grandhall/account");
      } else if (JSON.stringify(req.headers.referer).search("studio") >= 0) {
        res.redirect("/studio/account");
      } else if (JSON.stringify(req.headers.referer).search("support") >= 0) {
        res.redirect("/support/account");
      } else {
        res.redirect("/");
      }
    } else {
      const result = await db.checkPass("id", sess.userid, oldPassword);

      if (!result.checked) {
        res.render("login", {
          email: "",
          data: "Mật khẩu cũ không đúng",
          site: "changepass",
        });
      } else {
        if (newPassword == retypePassword) {
          db.updatePass(sess.userid, newPassword);
          if (JSON.stringify(req.headers.referer).search("grandhall") >= 0) {
            res.redirect("/grandhall");
          } else if (
            JSON.stringify(req.headers.referer).search("studio") >= 0
          ) {
            res.redirect("/studio");
          } else {
            res.redirect("/");
          }
        } else {
          res.render("login", {
            email: "",
            data: "Mật khẩu nhập lại không khớp",
            site: "changepass",
          });
        }
      }
    }
  });

// router.route("/reset").get(function (req, res, next) {
//   const sess = req.session;
//   const query = req.query;

//   if (!sess.name || !sess.userid || !sess.permission) {
//     res.redirect("/");
//   } else if (sess.permission == "admin") {
//     db.updatePass(query.p, "");

//     if (JSON.stringify(req.headers.referer).search("/grandhall") >= 0) {
//       res.redirect("/grandhall?p=account&n=all");
//     } else if (JSON.stringify(req.headers.referer).search("/studio") >= 0) {
//       res.redirect("/studio?p=account&n=all");
//     } else {
//       res.redirect("/");
//     }
//   } else {
//     res.redirect("/");
//   }
// });

module.exports = router;
