var nodemailer = require("nodemailer");
var fs = require("fs");
var path = require("path");

const listAdmin =
  "pmo@hcmute.edu.vn, viettien@hcmute.edu.vn, nhanvt@hcmute.edu.vn, caltd@hcmute.edu.vn, nhiptt@hcmute.edu.vn, nganttk@hcmute.edu.vn";
const listAdminTest = "nhanvt@hcmute.edu.vn";
const listAdminStudio =
  "nhanvt@hcmute.edu.vn, viettien@hcmute.edu.vn, caltd@hcmute.edu.vn";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

module.exports.newRegistration = async function (
  name,
  startTime,
  endTime,
  reason,
  responsible,
  phone,
  createdBy,
  place
) {
  fs.readFile(
    path.join(__dirname, "../public/html") + "/newRegistration.html",
    "utf-8",
    function (error, html) {
      if (error) throw error;

      html = html.replace("{ name }", name);
      html = html.replace("{ responsible }", responsible);
      html = html.replace("{ phone }", phone);
      html = html.replace("{ startTime }", startTime);
      html = html.replace("{ endTime }", endTime);
      html = html.replace("{ reason }", reason);
      html = html.replace("{ createdBy }", createdBy);

      if (place == "studio") {
        html = html.replace("{ title }", "LỊCH STUDIO CÓ ĐĂNG KÝ MỚI");

        var mailOptions = {
          from: '"Press and Media Office" <pmo@hcmute.edu.vn>', // sender address
          to: listAdminTest, // list of receivers
          subject: "Sự kiện mới trong lịch đăng ký studio", // Subject line
          html: html, // html body
        };
      }

      transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          console.log("Error " + err);
        } else {
          console.log("Email sent successfully");
        }
      });
    }
  );
};

module.exports.registration = async function (
  mail,
  name,
  startTime,
  endTime,
  reason,
  responsible,
  phone,
  createdBy,
  place
) {
  fs.readFile(
    path.join(__dirname, "../public/html") + "/Registration.html",
    "utf-8",
    function (error, html) {
      if (error) throw error;

      html = html.replace("{ name }", name);
      html = html.replace("{ responsible }", responsible);
      html = html.replace("{ phone }", phone);
      html = html.replace("{ startTime }", startTime);
      html = html.replace("{ endTime }", endTime);
      html = html.replace("{ reason }", reason);
      html = html.replace("{ createdBy }", createdBy);

      if (place == "grandhall") {
        html = html.replace(
          "{ title }",
          "ĐĂNG KÝ LỊCH SỬ DỤNG HỘI TRƯỜNG THÀNH CÔNG"
        );

        var mailOptions = {
          from: '"Press and Media Office" <pmo@hcmute.edu.vn>', // sender address
          to: mail, // list of receivers
          subject: "Xác nhận đăng ký lịch sử dụng hội trường", // Subject line
          html: html, // html body
        };
      }

      transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          console.log("Error " + err);
        } else {
          console.log("Email sent successfully");
        }
      });
    }
  );
};

module.exports.approved = async function (
  mail,
  name,
  responsible,
  phone,
  startTime,
  endTime,
  createdBy,
  approved,
  place,
  reason
) {
  if (place == "grandhall") {
    if (approved == "true") {
      fs.readFile(
        path.join(__dirname, "../public/html") + "/approved.html",
        "utf-8",
        function (error, html) {
          if (error) throw error;

          html = html.replace("{ name }", name);
          html = html.replace("{ responsible }", responsible);
          html = html.replace("{ phone }", phone);
          html = html.replace("{ startTime }", startTime);
          html = html.replace("{ endTime }", endTime);
          html = html.replace("{ createdBy }", createdBy);
          html = html.replace("{ title }", "XÁC NHẬN LỊCH ĐĂNG KÝ HỘI TRƯỜNG");
          html = html.replace("{ icon }", "1-4Sz0DOlbqBmYRw8Wt0Am1Tg3uKXvaQV");

          var mailOptions = {
            from: '"Press and Media Office" <pmo@hcmute.edu.vn>', // sender address
            to: mail, // list of receivers
            subject: "Xác nhận đăng ký lịch sử dụng hội trường", // Subject line
            html: html, // html body
          };

          transporter.sendMail(mailOptions, function (err, data) {
            if (err) {
              console.log("Error " + err);
            } else {
              console.log("Email sent successfully");
            }
          });
        }
      );
    } else if (approved == "false") {
      fs.readFile(
        path.join(__dirname, "../public/html") + "/deny.html",
        "utf-8",
        function (error, html) {
          if (error) throw error;

          html = html.replace("{ name }", name);
          html = html.replace("{ responsible }", responsible);
          html = html.replace("{ phone }", phone);
          html = html.replace("{ startTime }", startTime);
          html = html.replace("{ endTime }", endTime);
          html = html.replace("{ createdBy }", createdBy);
          html = html.replace("{ title }", "TỪ CHỐI LỊCH ĐĂNG KÝ HỘI TRƯỜNG");
          html = html.replace("{ icon }", "1AXPiRcWgdNuSdU2oiVXnBPtJadJp2RSE");
          html = html.replace("{ reason }", reason);

          var mailOptions = {
            from: '"Press and Media Office" <pmo@hcmute.edu.vn>', // sender address
            to: mail, // list of receivers
            subject: "Xác nhận đăng ký lịch sử dụng hội trường", // Subject line
            html: html, // html body
          };

          transporter.sendMail(mailOptions, function (err, data) {
            if (err) {
              console.log("Error " + err);
            } else {
              console.log("Email sent successfully");
            }
          });
        }
      );
    }
  }
};
