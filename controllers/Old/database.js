var mongoose = require("mongoose");
const { filters } = require("pug/lib");
var pwd = require("../authentication");
var mailer = require("./mailer");
var debugDatabase = require("debug")("pmo:database");
const cron = require("node-cron");
const spawn = require("child_process").spawn;

today = new Date();

// Connection URL. This is where your mongodb server is running.
// var url = "mongodb://" + username + ":" + password + "@database:27017/pmoData?authMechanism=DEFAULT";
const url = process.env.DATABASE_URL;

// var url =
//     "mongodb+srv://thanhnhan140395:JvEPT7qjY2sSScHz@augusthouse.lwyospy.mongodb.net/pmoData?authMechanism=DEFAULT";

var options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// create an schema
const usersModel = require("../model/users");
const usersInfoModel = require("../model/usersInfo");
const eventInfoModel = require("../model/eventInfo");
const studioModel = require("../model/studio");
const supportModel = require("../model/support");

module.exports.toType = function (obj) {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
};

module.exports.dateTime = function (data) {
  var date = {
    date: data.getDate(),
    month: data.getMonth(),
    year: data.getFullYear(),
    hour: data.getHours(),
    minute: data.getMinutes(),
  };
  return date;
};

module.exports.connect = async function () {
  try {
    // Connect the client to the server
    await mongoose.connect(url, options, function (err) {
      if (err) throw err;
      debugDatabase("Connection to database server was successful...");
    });
  } catch (e) {
    console.error(e);
  }
};

//SECTION - Database backup and restore
module.exports.backupTask = async function (time) {
  let dbBackupTask = cron.schedule(time, () => {
    let backupProcess = spawn("mongodump", [
      "--host=database",
      "--port=27017",
      "--username=pmo",
      "--password=Truyenthong1962",
      "--db=pmoData",
      "--archive=../dbBackup/",
      "--gzip",
    ]);

    backupProcess.on("exit", (code, signal) => {
      if (code) console.log("Backup process exited with code ", code);
      else if (signal)
        console.error("Backup process was killed with singal ", signal);
      else console.log("Successfully backedup the database");
    });
  });
  return dbBackupTask;
};

module.exports.restoreTask = async function () {
  let restoreProcess = spawn("mongorestore", [
    "--host=database",
    "--port=27017",
    "--username=pmo",
    "--password=Truyenthong1962",
    "../dbBackup/",
  ]);

  restoreProcess.on("exit", (code, signal) => {
    if (code) console.log("Backup process exited with code ", code);
    else if (signal)
      console.error("Backup process was killed with singal ", signal);
    else console.log("Successfully backedup the database");
  });
};
//!SECTION - Database backup and restore

//SECTION - register new account
module.exports.register = async function (
  name,
  email,
  pass,
  permission,
  fee,
  phone,
  unitName,
  role,
  createdBy
) {
  const filter = {
    email: email,
  };

  try {
    var dataTemp = await usersModel.find(filter);
  } catch (error) {
    console.error(error);
  }

  console.log(dataTemp);

  if (dataTemp.length == 0) {
    var password;
    if (pass == "") {
      password = pwd.saltHashPassword("123456");
    } else {
      password = pwd.saltHashPassword(pass);
    }

    var userInfo = new usersInfoModel({
      email: email,
      phone: phone,
      unitName: unitName,
      role: role,
      createdBy: createdBy,
    });

    try {
      await userInfo.save(async function (err, user) {
        if (err) throw err;

        var user = new usersModel({
          name: name,
          email: email,
          password: password.passwordHash,
          salt: password.salt,
          permission: permission,
          fee: fee,
          userID: user._id,
        });

        try {
          await user.save();
        } catch (error) {
          console.error(error);
        }
      });
    } catch (error) {
      console.error(error);
    }

    debugDatabase("User " + name + " successfully saved.");
  } else {
    var data = {
      $set: {
        fee: fee,
      },
    };

    try {
      let result = await usersModel.findOneAndUpdate(filter, data);
      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
    }
    //debugDatabase("User " + name + " already saved.");
  }
};
//!SECTION - register new account

module.exports.checkUser = async function (option, data, password) {
  var filter = {};

  if (option == "email") {
    filter.email = data;
  } else {
    filter._id = mongoose.Types.ObjectId(data);
  }

  try {
    let result = await usersModel.findOne(filter);

    var temp = {};
    if (!result) {
      temp = {
        name: "",
        id: "",
        checked: false,
      };
    } else {
      temp = {
        name: result.name,
        id: result._id.toString(),
        permission: result.permission,
        checked: pwd.isPasswordCorrect(password, result.password, result.salt),
      };
    }
    return temp;
  } catch (error) {
    console.error(error);
  }
};

module.exports.getAccount = async function (permission) {
  var filter = {};

  if (permission != "all") {
    filter = {
      permission: permission,
    };
  }

  try {
    var temp = await usersModel.find(filter);
  } catch (error) {
    console.error(error);
  }

  var result = [];

  for (let index = 0; index < temp.length; index++) {
    var data = {};
    var temp2 = await usersInfoModel.findOne({ userID: temp[index]._id });

    data.id = temp[index]._id.toString();
    data.name = temp[index].name;
    data.unitName = temp2.unitName;
    data.email = temp[index].email;
    data.phone = temp2.phone;

    result[index] = data;
  }

  return result;
};

module.exports.updatePass = async function (id, pass) {
  var filter = {};

  if (this.toType(id) === this.toType("id")) {
    filter._id = mongoose.Types.ObjectId(id);
  } else {
    filter._id = id;
  }

  var password;
  if (pass == "") {
    password = pwd.saltHashPassword("pmo@123");
  } else {
    password = pwd.saltHashPassword(pass);
  }

  const update = {
    password: password.passwordHash,
    salt: password.salt,
  };

  try {
    let result = await usersModel.findOneAndUpdate(filter, update);
    return result;
  } catch (error) {
    console.error(error);
  }
};

module.exports.getEventStudio = async function (approved) {
  var data = [];

  var filter = {
    startTime: {
      $gt: new Date(today.getFullYear(), today.getMonth() - 4),
      $lt: new Date(today.getFullYear(), today.getMonth() + 5),
    },
  };

  if (approved != "all") {
    filter.approved = approved;
  }

  try {
    var eventData = await studioModel
      .find(filter)
      .populate({
        path: "eventID",
        match: {
          startTime: {
            $gt: new Date(today.getFullYear(), today.getMonth() - 4),
            $lt: new Date(today.getFullYear(), today.getMonth() + 5),
          },
        },
      })
      .populate({
        path: "createdBy",
        select: "name",
      })
      .populate({
        path: "approvedBy",
        select: "name email",
        populate: { path: "userID", select: "phone" },
      })
      .sort({ startTime: 1 });
  } catch (error) {
    console.error(error);
  }

  for (let index = 0; index < eventData.length; index++) {
    var temp = {};

    temp.approvedBy = eventData[index].approvedBy.name;
    temp.approvedPhone = eventData[index].approvedBy.userID.phone;
    temp.approvedEmail = eventData[index].approvedBy.email;

    temp.createdBy = eventData[index].createdBy.name;

    temp.id = eventData[index]._id.toString();
    temp.name = eventData[index].eventID.name;
    temp.startTime = this.dateTime(eventData[index].eventID.startTime);
    temp.endTime = this.dateTime(eventData[index].eventID.endTime);
    temp.place = eventData[index].eventID.place;
    temp.reason = eventData[index].eventID.reason;
    temp.responsible = eventData[index].eventID.responsible;
    temp.phone = eventData[index].eventID.phone;

    temp.file = eventData[index].eventID.file;

    temp.approved = eventData[index].approved;

    temp.approvedOn = this.dateTime(eventData[index].approvedOn);
    temp.createdOn = this.dateTime(eventData[index].eventID.createdOn);

    data[index] = temp;
  }

  return data;
};

module.exports.getEventUserStudio = async function (userID, approved) {
  var data = [];

  var filter = {
    startTime: {
      $gt: new Date(today.getFullYear(), today.getMonth() - 4),
      $lt: new Date(today.getFullYear(), today.getMonth() + 5),
    },
    place: "studio",
    createdBy: mongoose.Types.ObjectId(userID),
  };

  if (approved != "all") {
    filter.approved = approved;
  }

  try {
    var eventData = await studioModel
      .find(filter)
      .populate({
        path: "eventID",
        match: {
          startTime: {
            $gt: new Date(today.getFullYear(), today.getMonth() - 4),
            $lt: new Date(today.getFullYear(), today.getMonth() + 5),
          },
        },
      })
      .populate({
        path: "createdBy",
      })
      .populate({
        path: "approvedBy",
      })
      .sort({ startTime: 1 });

    console.log(eventData);
  } catch (error) {
    console.error(error);
  }

  for (let index = 0; index < eventData.length; index++) {
    var temp = {};

    temp.approvedBy = eventData[index].approvedBy.name;
    temp.approvedPhone = eventData[index].approvedBy.userID.phone;
    temp.approvedEmail = eventData[index].approvedBy.email;

    temp.createdBy = eventData[index].createdBy.name;

    temp.id = eventData[index]._id.toString();
    temp.name = eventData[index].eventID.name;
    temp.startTime = this.dateTime(eventData[index].eventID.startTime);
    temp.endTime = this.dateTime(eventData[index].eventID.endTime);
    temp.place = eventData[index].eventID.place;
    temp.reason = eventData[index].eventID.reason;
    temp.responsible = eventData[index].eventID.responsible;
    temp.phone = eventData[index].eventID.phone;

    temp.file = eventData[index].eventID.file;

    temp.approved = eventData[index].approved;

    temp.approvedOn = this.dateTime(eventData[index].approvedOn);
    temp.createdOn = this.dateTime(eventData[index].eventID.createdOn);

    data[index] = temp;
  }

  return data;
};

module.exports.getEventSupport = async function (approved) {
  var data = [];

  var filter = {
    startTime: {
      $gt: new Date(today.getFullYear(), today.getMonth() - 4),
      $lt: new Date(today.getFullYear(), today.getMonth() + 5),
    },
  };

  if (approved != "all") {
    filter.$or = [
      { photo: approved },
      { video: approved },
      { livestream: approved },
    ];
  }

  try {
    var eventData = await supportModel
      .find(filter)
      .populate({
        path: "eventID",
        match: {
          startTime: {
            $gt: new Date(today.getFullYear(), today.getMonth() - 4),
            $lt: new Date(today.getFullYear(), today.getMonth() + 5),
          },
        },
      })
      .populate({
        path: "createdBy",
        select: "name",
      })
      .populate({
        path: "approvedBy",
        select: "name email",
        populate: { path: "userID", select: "phone" },
      })
      .sort({ startTime: 1 });
  } catch (error) {
    console.error(error);
  }
  console.log(eventData);

  for (let index = 0; index < eventData.length; index++) {
    var temp = {};

    temp.approvedBy = eventData[index].approvedBy.name;
    temp.approvedPhone = eventData[index].approvedBy.userID.phone;
    temp.approvedEmail = eventData[index].approvedBy.email;

    temp.createdBy = eventData[index].createdBy.name;

    temp.id = eventData[index]._id.toString();
    temp.name = eventData[index].eventID.name;
    temp.startTime = this.dateTime(eventData[index].eventID.startTime);
    temp.endTime = this.dateTime(eventData[index].eventID.endTime);
    temp.place = eventData[index].eventID.place;
    temp.reason = eventData[index].eventID.reason;
    temp.responsible = eventData[index].eventID.responsible;
    temp.phone = eventData[index].eventID.phone;

    temp.file = eventData[index].eventID.file;

    temp.photo = eventData[index].photo;
    temp.video = eventData[index].video;
    temp.livestream = eventData[index].livestream;
    // temp.approved = eventData[index].approved;

    temp.approvedOn = this.dateTime(eventData[index].approvedOn);
    temp.createdOn = this.dateTime(eventData[index].eventID.createdOn);

    data[index] = temp;
  }

  return data;
};

module.exports.getEventUserSupport = async function (userID, approved) {
  var data = [];

  var filter = {
    startTime: {
      $gt: new Date(today.getFullYear(), today.getMonth() - 4),
      $lt: new Date(today.getFullYear(), today.getMonth() + 5),
    },
    createdBy: mongoose.Types.ObjectId(userID),
  };

  if (approved != "all") {
    filter.$or = [
      { photo: approved },
      { video: approved },
      { livestream: approved },
    ];
  }

  try {
    var eventData = await supportModel
      .find(filter)
      .populate({
        path: "eventID",
        match: {
          startTime: {
            $gt: new Date(today.getFullYear(), today.getMonth() - 4),
            $lt: new Date(today.getFullYear(), today.getMonth() + 5),
          },
        },
      })
      .populate({
        path: "createdBy",
      })
      .populate({
        path: "approvedBy",
      })
      .sort({ startTime: 1 });

    console.log(eventData);
  } catch (error) {
    console.error(error);
  }

  for (let index = 0; index < eventData.length; index++) {
    var temp = {};

    temp.approvedBy = eventData[index].approvedBy.name;
    temp.approvedPhone = eventData[index].approvedBy.userID.phone;
    temp.approvedEmail = eventData[index].approvedBy.email;

    temp.createdBy = eventData[index].createdBy.name;

    temp.id = eventData[index]._id.toString();
    temp.name = eventData[index].eventID.name;
    temp.startTime = this.dateTime(eventData[index].eventID.startTime);
    temp.endTime = this.dateTime(eventData[index].eventID.endTime);
    temp.place = eventData[index].eventID.place;
    temp.reason = eventData[index].eventID.reason;
    temp.responsible = eventData[index].eventID.responsible;
    temp.phone = eventData[index].eventID.phone;

    temp.file = eventData[index].eventID.file;

    temp.approved = eventData[index].approved;

    temp.approvedOn = this.dateTime(eventData[index].approvedOn);
    temp.createdOn = this.dateTime(eventData[index].eventID.createdOn);

    data[index] = temp;
  }

  return data;
};

module.exports.addEvent = async function (
  name,
  startTime,
  endTime,
  place,
  reason,
  responsible,
  phone,
  createdBy,
  file,
  approved,
  photo,
  video,
  livestream,
  approvedBy
) {
  let filter = {
    name: name,
    startTime: startTime,
    endTime: endTime,
    place: place,
  };
  try {
    var result = await eventInfoModel.find(filter).sort({ starTime: 1 });
  } catch (error) {
    console.error(error);
  }

  if (result.length == 0) {
    var eventInfo = new eventInfoModel({
      name: name,
      startTime: startTime,
      endTime: endTime,
      place: place,
      reason: reason,
      responsible: responsible,
      phone: phone,
      createdBy: mongoose.Types.ObjectId(createdBy),
      file: file,
    });

    try {
      await eventInfo.save(async function (err, event) {
        if (err) throw err;

        if (place == "studio") {
          var studio = new studioModel({
            eventID: event._id,
            startTime: startTime,
            createdBy: mongoose.Types.ObjectId(createdBy),
            approved: approved,
            approvedBy: approvedBy,
          });

          try {
            await studio.save();
          } catch (error) {
            console.error(error);
          }
        }

        if (photo != "" || video != "" || livestream != "") {
          var supportData = new supportModel({
            eventID: event._id,
            startTime: startTime,
            createdBy: mongoose.Types.ObjectId(createdBy),
            photo: photo,
            video: video,
            livestream: livestream,
            approvedBy: approvedBy,
          });

          try {
            await supportData.save();
          } catch (error) {
            console.error(error);
          }
        }

        debugDatabase("Event ", event.name, " successfully saved.");
      });

      // mailer.newRegistration(
      //     name,
      //     startTime,
      //     endTime,
      //     reason,
      //     responsible,
      //     phone,
      //     createdBy,
      //     place
      // );
    } catch (error) {
      console.error(error);
    }
  } else {
    debugDatabase("Event already saved.");
  }
};

module.exports.updateEvent = async function (
  eventID,
  approved,
  reason,
  userID
) {
  var filter;
  var data = {
    approved: approved,
    approvedBy: mongoose.Types.ObjectId(userID),
    approvedOn: new Date(),
  };

  if (this.toType(userID) === this.toType("userID")) {
    filter = mongoose.Types.ObjectId(eventID);
  } else {
    filter = eventID;
  }

  var result = await studioModel.findByIdAndUpdate(filter, data);

  // const result = await db.findGrandhallByID(id);
  // const result2 = await db.findUserByID(result.createdBy);
  // const result3 = await db.findEventByID(result.eventID);

  // if (approved == "true") {
  //     mailer.approved(
  //         result2.email,
  //         result3.name,
  //         result3.responsible,
  //         result3.phone,
  //         result3.startTime,
  //         result3.endTime,
  //         result2.name,
  //         approved,
  //         "grandhall",
  //         ""
  //     );
  // } else if (approved == "false") {
  //     mailer.approved(
  //         result2.email,
  //         result3.name,
  //         result3.responsible,
  //         result3.phone,
  //         result3.startTime,
  //         result3.endTime,
  //         result2.name,
  //         approved,
  //         "grandhall",
  //         reason
  //     );
  // }
};

module.exports.updateEventSupport = async function (
  eventID,
  approved,
  support,
  reason,
  userID
) {
  var filter;
  var data = {
    approvedBy: mongoose.Types.ObjectId(userID),
    approvedOn: new Date(),
  };

  if (support == "Photo") {
    data.photo = approved;
  }
  if (support == "Video") {
    data.video = approved;
  }
  if (support == "Livestream") {
    data.livestream = approved;
  }

  if (this.toType(eventID) === this.toType("userID")) {
    filter = mongoose.Types.ObjectId(eventID);
  } else {
    filter = eventID;
  }

  var result = await supportModel.findByIdAndUpdate(filter, data);

  // const result = await db.findGrandhallByID(id);
  // const result2 = await db.findUserByID(result.createdBy);
  // const result3 = await db.findEventByID(result.eventID);

  // if (approved == "true") {
  //     mailer.approved(
  //         result2.email,
  //         result3.name,
  //         result3.responsible,
  //         result3.phone,
  //         result3.startTime,
  //         result3.endTime,
  //         result2.name,
  //         approved,
  //         "grandhall",
  //         ""
  //     );
  // } else if (approved == "false") {
  //     mailer.approved(
  //         result2.email,
  //         result3.name,
  //         result3.responsible,
  //         result3.phone,
  //         result3.startTime,
  //         result3.endTime,
  //         result2.name,
  //         approved,
  //         "grandhall",
  //         reason
  //     );
  // }
};

module.exports.updateEvent_support = async function (
  eventID,
  approved,
  support,
  reason,
  userID
) {
  var filter;
  var data = {
    approved: approved,
    approvedBy: userID,
    approvedOn: new Date(),
  };

  if (this.toType(userID) === this.toType("userID")) {
    filter = mongoose.Types.ObjectId(eventID);
  } else {
    filter = userID;
  }

  var result = await eventModel.findByIdAndUpdate(filter, data);

  var data = {
    approvedBy: userID,
    approvedOn: new Date(),
  };

  if (support == "Photo") {
    data.photo = approved;
  } else if (support == "Video") {
    data.video = approved;
  } else if (support == "Livestream") {
    data.livestream = approved;
  }

  // const result = await db.findGrandhallByID(id);
  // const result2 = await db.findUserByID(result.createdBy);
  // const result3 = await db.findEventByID(result.eventID);

  // if (approved == "true") {
  //     mailer.approved(
  //         result2.email,
  //         result3.name,
  //         result3.responsible,
  //         result3.phone,
  //         result3.startTime,
  //         result3.endTime,
  //         result2.name,
  //         approved,
  //         "grandhall",
  //         ""
  //     );
  // } else if (approved == "false") {
  //     mailer.approved(
  //         result2.email,
  //         result3.name,
  //         result3.responsible,
  //         result3.phone,
  //         result3.startTime,
  //         result3.endTime,
  //         result2.name,
  //         approved,
  //         "grandhall",
  //         reason
  //     );
  // }
};
