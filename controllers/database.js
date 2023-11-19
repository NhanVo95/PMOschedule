const mongoose = require("mongoose");
const pwd = require("./authentication");
const debugDatabase = require("debug")("pmo:database");

var today = new Date();

// Connection URL. This is where your mongodb server is running.
// var url = "mongodb://" + username + ":" + password + "@database:27017/pmoData?authMechanism=DEFAULT";
const url = process.env.DATABASE_URL;

// var url =
//     "mongodb+srv://thanhnhan140395:JvEPT7qjY2sSScHz@augusthouse.lwyospy.mongodb.net/pmoData?authMechanism=DEFAULT";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// create an schema
const usersModel = require("../model/users");
const usersInfoModel = require("../model/usersInfo");
const eventInfoModel = require("../model/eventInfo");
const studioModel = require("../model/studio");
const supportModel = require("../model/support");
const bandrollModel = require("../model/bandroll");

function toType(obj) {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
}

module.exports.connect = async function () {
  try {
    await mongoose.connect(url, options);
    debugDatabase("Connection to database server was successful...");
  } catch (error) {
    debugDatabase(error);
  }
};

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
    debugDatabase(error);
  }

  if (dataTemp.length == 0) {
    var password;
    if (pass == "") {
      password = pwd.saltHashPassword("123456");
    } else {
      password = pwd.saltHashPassword(pass);
    }

    var userInfo = new usersInfoModel({
      _id: new mongoose.Types.ObjectId(),
      email: email,
      phone: phone,
      unitName: unitName,
      role: role,
      createdBy: createdBy,
    });

    try {
      await userInfo.save();

      var user = new usersModel({
        name: name,
        email: email,
        password: password.passwordHash,
        salt: password.salt,
        permission: permission,
        fee: fee,
        userID: userInfo._id,
      });

      await user.save();

      debugDatabase("User " + name + " successfully saved.");
    } catch (error) {
      debugDatabase(error);
    }
  } else {
    var data = {
      $set: {
        name: name,
        email: email,
        fee: fee,
      },
    };

    try {
      await usersModel.findOneAndUpdate(filter, data);

      debugDatabase("User " + name + " successfully updated.");
    } catch (error) {
      debugDatabase(error);
    }
  }
};
//!SECTION - register new account

module.exports.checkPass = async function (option, data, password) {
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
    debugDatabase(error);
  }
};

module.exports.updatePass = async function (id, pass) {
  var password;
  if (pass == "") {
    password = pwd.saltHashPassword("123456");
  } else {
    password = pwd.saltHashPassword(pass);
  }

  var update = {
    password: password.passwordHash,
    salt: password.salt,
  };

  try {
    let result = await usersModel.findByIdAndUpdate(id, update);
    return result;
  } catch (error) {
    debugDatabase(error);
  }
};

module.exports.getIDadmin = async function (email) {
  var filterAdmin = { email: email };

  try {
    let result = await usersModel.findOne(filterAdmin);

    return result._id;
  } catch (error) {
    debugDatabase(error);
  }
};

module.exports.getAccount = async function (role) {
  var filter = {};

  if (role != "all") {
    filter = { permission: role };
  }

  try {
    let result = await usersModel.find(filter).populate({
      path: "userID",
      // match: filter,
      // select: "name",
    });

    return result;
  } catch (error) {
    debugDatabase(error);
  }
};

//NOTE - data of event is:
// {name, startTime, endTime, place, reason, responsible, phone, createdBy, file, approved, photo, video, livestream, approvedBy}
module.exports.addEvent = async function (data) {
  if (data.place == "other") {
  }
  let filter = {
    name: data.name,
    startTime: data.startTime,
    place: data.place,
  };
  try {
    var result = await eventInfoModel.find(filter).sort({ starTime: 1 });
  } catch (error) {
    debugDatabase(error);
  }

  if (result.length == 0) {
    var eventInfo = new eventInfoModel({
      _id: new mongoose.Types.ObjectId(),
      name: data.name,
      startTime: data.startTime,
      endTime: data.endTime,
      place: data.place,
      reason: data.reason,
      responsible: data.responsible,
      phone: data.phone,
      createdBy: data.createdBy,
      file: data.file,
    });

    try {
      await eventInfo.save();

      if (data.place == "studio") {
        var studio = new studioModel({
          eventID: eventInfo._id,
          startTime: data.startTime,
          endTime: data.endTime,
          createdBy: data.createdBy,
          approved: data.approved,
          approvedBy: data.approvedBy,
        });

        try {
          await studio.save();
        } catch (error) {
          debugDatabase(error);
        }
      }

      if (data.photo != "" || data.video != "" || data.livestream != "") {
        var supportData = new supportModel({
          eventID: eventInfo._id,
          startTime: data.startTime,
          endTime: data.endTime,
          createdBy: data.createdBy,
          photo: data.photo,
          video: data.video,
          livestream: data.livestream,
          approvedBy: data.approvedBy,
        });

        try {
          await supportData.save();
        } catch (error) {
          debugDatabase(error);
        }
      }

      debugDatabase("Event ", eventInfo.name, " successfully saved.");

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
      debugDatabase(error);
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
  var filter = eventID;
  var data = {
    approved: approved,
    approvedBy: userID,
    reason: reason,
    approvedOn: new Date(),
  };

  // if (this.toType(userID) === this.toType("userID")) {
  //   filter = mongoose.Types.ObjectId(eventID);
  // } else {
  //   filter = eventID;
  // }

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
  support,
  approved,
  reason,
  userID
) {
  var filter = eventID;
  var data = {
    approvedBy: userID,
    reason: reason,
    approvedOn: new Date(),
  };

  switch (support) {
    case "photo":
      data.photo = approved;
      break;

    case "video":
      data.video = approved;
      break;

    case "livestream":
      data.livestream = approved;
      break;

    default:
      break;
  }

  // if (this.toType(userID) === this.toType("userID")) {
  //   filter = mongoose.Types.ObjectId(eventID);
  // } else {
  //   filter = eventID;
  // }

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

module.exports.getEvent = async function (place, month, approved) {
  var filter = {};

  if (month != "all") {
    filter = {
      $and: [
        {
          startTime: {
            $lte: new Date(today.getFullYear(), month),
          },
        },
        {
          endTime: {
            $gte: new Date(today.getFullYear(), month - 1),
          },
        },
      ],
    };
  }

  var eventData = {};

  if (place == "studio") {
    if (approved != "all") {
      filter.approved = approved;
    }

    //criteria for sort can be asc, desc, ascending, descending, 1, or -1
    try {
      eventData = await studioModel
        .find({})
        .populate({
          path: "eventID",
          match: filter,
          options: { sort: [["startTime", "desc"]] },
        })
        .populate({
          path: "createdBy",
          select: "name",
        })
        .populate({
          path: "approvedBy",
          select: "name email",
          populate: { path: "userID", select: "phone" },
        });
      // .sort({ startTime: 1 });
    } catch (error) {
      debugDatabase(error);
    }
  } else {
    if (approved != "all") {
      filter.$or = [
        { photo: approved },
        { video: approved },
        { livestream: approved },
      ];
    }
    try {
      eventData = await supportModel
        .find(filter)
        .populate({
          path: "eventID",
          // match: filter,
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
        .sort({ startTime: 0 });
    } catch (error) {
      debugDatabase(error);
    }
  }

  return eventData;
};

module.exports.getEventID = async function (place, userid, month, approved) {
  var filter = {};

  if (month != "all") {
    filter = {
      $and: [
        {
          startTime: {
            $lte: new Date(today.getFullYear(), month),
          },
        },
        {
          endTime: {
            $gte: new Date(today.getFullYear(), month - 1),
          },
        },
      ],
    };
  }

  if (userid != "admin") {
    filter.createdBy = userid;
  }

  if (approved != "all") {
    filter.approved = approved;
  }

  if (place == "studio") {
    try {
      var eventData = await studioModel
        .find(filter)
        .populate({
          path: "eventID",
          // match: filter,
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
        .sort({ startTime: 0 });
    } catch (error) {
      debugDatabase(error);
    }
  } else {
    try {
      var eventData = await supportModel
        .find(filter)
        .populate({
          path: "eventID",
          // match: filter,
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
        .sort({ startTime: 0 });
    } catch (error) {
      debugDatabase(error);
    }
  }

  return eventData;
};
