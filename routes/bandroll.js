const express = require("express");
const redis = require("../controllers/redis");
const router = express.Router();

const title = "LỊCH ĐĂNG KÝ TREO BANDROLL, CỜ, PHƯỚN";
const link = "bandroll";

// NOTE - library for file handle
const multer = require("multer");

// NOTE - Configuration for Multer
// const upload = multer({ dest: "public/files" });
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/pdf");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `KH-bandroll-${Date.now().toLocaleString("vi-VN")}.${ext}`);
    // cb(null, `KH-${file.fieldname}-${Date.now()}.${ext}`);
  },
});

// Multer Filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "pdf") {
    cb(null, true);
  } else {
    cb(new Error("Not a PDF File!!"), false);
  }
};

//Calling the "multer" Function
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

var db = require("../controllers/database");

/* GET home page. */
router
  .route("/")
  .get(async function (req, res, next) {
    const sess = req.session;
    const query = req.query;

    const user = await redis.retrieveRedis(sess.userid);

    if (!sess.userid || !(user.length != 2)) {
      res.render("schedule", {
        title: title,
        link: link,
      });
    } else {
      if (user.permission == "admin") {
        switch (query.p) {
          case "addevent":
            res.render("adminAddEvent", {
              name: "admin " + user.name,
              title: title,
              link: link,
            });
            break;

          case "listevent":
            switch (query.n) {
              case "all":
                res.render("adminListEvent", {
                  name: "admin " + user.name,
                  status: "all",
                  title: title,
                  link: link,
                });
                break;

              case "waiting":
                res.render("adminListEvent", {
                  name: "admin " + user.name,
                  status: "waiting",
                  title: title,
                  link: link,
                });
                break;

              case "approved":
                res.render("adminListEvent", {
                  name: "admin " + user.name,
                  status: "approved",
                  title: title,
                  link: link,
                });
                break;

              case "deny":
                res.render("adminListEvent", {
                  name: "admin " + user.name,
                  status: "deny",
                  title: title,
                  link: link,
                });
                break;

              default:
                res.redirect("/bandroll?p=listevent&n=all");
                break;
            }
            break;

          case "account":
            switch (query.n) {
              case "all":
                res.render("adminListAccount", {
                  name: "admin " + user.name,
                  status: "all",
                  title: title,
                  link: link,
                });
                break;

              case "admin":
                res.render("adminListAccount", {
                  name: "admin " + user.name,
                  status: "admin",
                  title: title,
                  link: link,
                });
                break;

              case "user":
                res.render("adminListAccount", {
                  name: "admin " + user.name,
                  status: "user",
                  title: title,
                  link: link,
                });
                break;

              default:
                res.redirect("/bandroll?p=account&n=all");
                break;
            }
            break;

          default:
            res.render("adminSchedule", {
              name: "admin " + user.name,
              title: title,
              link: link,
            });
            break;
        }
      } else {
        switch (query.p) {
          case "schedule":
            res.render("signedSchedule", {
              name: user.name,
              title: title,
              link: link,
            });
            break;

          case "addevent":
            res.render("signedAddEvent", {
              name: user.name,
              title: title,
              link: link,
            });
            break;

          case "listevent":
            switch (query.n) {
              case "waiting":
                res.render("signedListEvent", {
                  name: user.name,
                  status: false,
                  title: title,
                  link: link,
                });
                break;

              case "approved":
                res.render("signedListEvent", {
                  name: user.name,
                  status: true,
                  title: title,
                  link: link,
                });
                break;

              case "all":
                res.render("signedListEvent", {
                  name: user.name,
                  status: "all",
                  title: title,
                  link: link,
                });
                break;

              default:
                res.redirect("/bandroll?p=listevent&n=all");
                break;
            }
            break;

          default:
            res.redirect("/bandroll?p=schedule");
            break;
        }

        // if (query.p == "schedule") {
        //   res.render("signedSchedule", {
        //     name: user.name,
        //     title: title,
        //     link: link,
        //   });
        // } else if (query.p == "addevent") {
        //   res.render("signedAddEvent", {
        //     name: user.name,
        //     title: title,
        //     link: link,
        //   });
        // } else if (query.p == "listevent") {
        //   if (query.n == "waiting") {
        //     res.render("signedListEvent", {
        //       name: user.name,
        //       status: false,
        //       title: title,
        //       link: link,
        //       events: await db.getEventUserStudio(user.userid, "waiting"),
        //     });
        //   } else if (query.n == "approved") {
        //     res.render("signedListEvent", {
        //       name: user.name,
        //       status: true,
        //       title: title,
        //       link: link,
        //       events: await db.getEventUserStudio(user.userid, "true"),
        //     });
        //   } else if (query.n == "all") {
        //     res.render("signedListEvent", {
        //       name: user.name,
        //       status: "all",
        //       title: title,
        //       link: link,
        //       events: await db.getEventUserStudio(user.userid, "all"),
        //     });
        //   } else {
        //     res.redirect("/studio?p=listevent&n=all");
        //   }
        // } else {
        //   res.redirect("/studio?p=schedule");
        // }
      }
    }
  })
  .post(upload.single("FileKH"), async function (req, res, next) {
    const sess = req.session;

    const user = await redis.retrieveRedis(sess.userid);

    if (!sess.userid || !(user.length != 2)) {
      res.redirect(link);
    } else {
      const {
        name,
        startTime,
        endTime,
        reason,
        responsible,
        phone,
        photo,
        video,
        livestream,
      } = req.body;

      var data = {
        approved: "waiting",
        photo: "",
        video: "",
        livestream: "",
        name: name,
        place: "studio",
        reason: reason,
        responsible: responsible,
        phone: phone,
        createdBy: user.id,
        file: req.file.filename,
        startTime: new Date(
          startTime.slice(6, 11),
          startTime.slice(3, 5) - 1,
          startTime.slice(0, 2),
          startTime.slice(11, 13),
          startTime.slice(14, 16)
        ),
        endTime: new Date(
          endTime.slice(6, 11),
          endTime.slice(3, 5) - 1,
          endTime.slice(0, 2),
          endTime.slice(11, 13),
          endTime.slice(14, 16)
        ),
      };

      if (user.permission == "admin") {
        data.approved = "true";
        data.approvedBy = user.id;

        if (photo == "true") {
          data.photo = "true";
        }
        if (video == "true") {
          data.video = "true";
        }
        if (livestream == "true") {
          data.livestream = "true";
        }
      } else {
        db.getIDadmin("pmo@hcmute.edu.vn").then((result) => {
          data.approvedBy = result;
        });

        if (photo == "true") {
          data.photo = "waiting";
        }
        if (video == "true") {
          data.video = "waiting";
        }
        if (livestream == "true") {
          data.livestream = "waiting";
        }
      }

      db.addEvent(data);

      res.redirect(link);
    }
  });

router.route("/approved").get(async function (req, res, next) {
  const sess = req.session;
  const query = req.query;

  const user = await redis.retrieveRedis(sess.userid);

  if (user.permission == "admin") {
    await db.updateEvent(query.id, query.approved, query.reason, user.userid);

    res.redirect("/bandroll?p=listevent&n=all");
  } else {
    res.redirect(link);
  }
});

module.exports = router;
