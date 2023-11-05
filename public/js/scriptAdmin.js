today = new Date();
currentMonth = today.getMonth();
currentYear = today.getFullYear();
selectYear = document.getElementById("year");
selectMonth = document.getElementById("month");

months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

monthAndYear = document.getElementById("monthAndYear");

function convertTime(startHour, startMinute, endHour, endMinute) {
  if (startHour < 10) {
    text = "0" + startHour;
  } else {
    text = startHour;
  }
  text += ":";
  if (startMinute < 10) {
    text += "0" + startMinute;
  } else {
    text += startMinute;
  }
  text += " - ";
  if (endHour < 10) {
    text += "0" + endHour;
  } else {
    text += endHour;
  }
  text += ":";
  if (endMinute < 10) {
    text += "0" + endMinute;
  } else {
    text += endMinute;
  }

  return text;
}

function convertFullTime(hour, minute, date, month, year) {
  if (hour < 10) {
    text = "0" + hour + ":";
  } else {
    text = hour + ":";
  }
  if (minute < 10) {
    text += "0" + minute + " - ";
  } else {
    text += minute + " - ";
  }
  if (date < 10) {
    text += "0" + date + "/";
  } else {
    text += date + "/";
  }
  if (month + 1 < 10) {
    text += "0" + (month + 1) + "/";
  } else {
    text += month + 1 + "/";
  }
  text += year;
}

function showBlockReply(events) {
  block = document.getElementById("blockForm");

  // clearing all things
  block.innerHTML = "";
  for (let index = 0; index < events.length; index++) {
    cellId = document.createElement("div");
    cellId.setAttribute("id", "pmoReply" + events[index]._id);
    cellId.classList.add("modal");

    cellEventdiv1 = document.createElement("div");
    cellEventdiv1.classList.add("modal-content");

    cellEventdiv2 = document.createElement("div");
    cellEventdiv2.classList.add("modal-header");

    cellEventspan = document.createElement("span");
    cellEventspan.setAttribute("id", "pmoReply" + events[index]._id);
    cellEventspanText = document.createTextNode("×");
    cellEventspan.classList.add("close");
    cellEventspan.appendChild(cellEventspanText);

    cellEventh2 = document.createElement("h2");
    cellEventh2Text = document.createTextNode(
      "CHI TIẾT TỪ CHỐI ĐĂNG KÝ CHƯƠNG TRÌNH"
    );
    cellEventh2.appendChild(cellEventh2Text);

    cellEventdiv2.appendChild(cellEventspan);
    cellEventdiv2.appendChild(cellEventh2);
    cellEventdiv1.appendChild(cellEventdiv2);

    cellEventdiv3 = document.createElement("div");
    cellEventdiv3.classList.add("modal-body");

    cellForm = document.createElement("form");
    cellForm.setAttribute("action", link + "/approved");
    cellForm.setAttribute("method", "get");

    cellEventdiv4 = document.createElement("div");
    cellEventdiv4.classList.add("form-outline");
    cellEventdiv4.classList.add("mb-4");

    cellInput = document.createElement("input");
    cellInput.setAttribute("id", "id");
    cellInput.classList.add("form-control");
    cellInput.setAttribute("type", "hidden");
    cellInput.setAttribute("name", "id");
    cellInput.setAttribute("value", events[index]._id);

    cellEventdiv4.appendChild(cellInput);

    cellForm.appendChild(cellEventdiv4);

    cellEventdiv4 = document.createElement("div");
    cellEventdiv4.classList.add("form-outline");
    cellEventdiv4.classList.add("mb-4");

    cellInput = document.createElement("input");
    cellInput.setAttribute("id", "approved");
    cellInput.classList.add("form-control");
    cellInput.setAttribute("type", "hidden");
    cellInput.setAttribute("name", "approved");
    cellInput.setAttribute("value", "false");

    cellEventdiv4.appendChild(cellInput);

    cellForm.appendChild(cellEventdiv4);

    cellEventdiv4 = document.createElement("div");
    cellEventdiv4.classList.add("form-outline");
    cellEventdiv4.classList.add("mb-4");

    cellInput = document.createElement("input");
    cellInput.setAttribute("id", "name");
    cellInput.classList.add("form-control");
    cellInput.classList.add("active");
    cellInput.setAttribute("type", "text");
    cellInput.setAttribute("value", events[index].eventID.name);
    cellInput.setAttribute("readonly", true);

    cellLabel = document.createElement("label");
    cellLabel.classList.add("form-label");
    cellLabel.setAttribute("for", "name");
    cellLabelText = document.createTextNode("Tên chương trình");
    cellLabel.appendChild(cellLabelText);

    cellEventdiv4.appendChild(cellInput);
    cellEventdiv4.appendChild(cellLabel);

    cellForm.appendChild(cellEventdiv4);

    cellEventdiv4 = document.createElement("div");
    cellEventdiv4.classList.add("form-outline");
    cellEventdiv4.classList.add("mb-4");

    cellInput = document.createElement("input");
    cellInput.setAttribute("id", "reason");
    cellInput.classList.add("form-control");
    cellInput.classList.add("required");
    cellInput.setAttribute("type", "text");
    cellInput.setAttribute("name", "reason");

    cellLabel = document.createElement("label");
    cellLabel.classList.add("form-label");
    cellLabel.setAttribute("for", "reason");
    cellLabelText = document.createTextNode("Lý do từ chối chương trình");
    cellLabel.appendChild(cellLabelText);

    cellEventdiv4.appendChild(cellInput);
    cellEventdiv4.appendChild(cellLabel);

    cellForm.appendChild(cellEventdiv4);

    cellButton = document.createElement("button");
    cellButton.classList.add("btn");
    cellButton.classList.add("btn-primary");
    cellButton.classList.add("btn-block");
    cellButton.classList.add("mb-4");
    cellButtonText = document.createTextNode("Xác nhận");
    cellButton.appendChild(cellButtonText);

    cellForm.appendChild(cellButton);

    cellEventdiv3.appendChild(cellForm);
    cellEventdiv1.appendChild(cellEventdiv3);
    cellId.appendChild(cellEventdiv1);
    block.appendChild(cellId);
  }
}

function showBlockReply_supportTask(support, event) {
  cellId = document.createElement("div");
  cellId.setAttribute("id", "pmoReply" + support + event.id);
  cellId.classList.add("modal");

  cellEventdiv1 = document.createElement("div");
  cellEventdiv1.classList.add("modal-content");

  cellEventdiv2 = document.createElement("div");
  cellEventdiv2.classList.add("modal-header");

  cellEventspan = document.createElement("span");
  cellEventspan.setAttribute("id", "pmoReply" + support + event.id);
  cellEventspanText = document.createTextNode("×");
  cellEventspan.classList.add("close");
  cellEventspan.appendChild(cellEventspanText);

  cellEventh2 = document.createElement("h2");
  cellEventh2Text = document.createTextNode(
    "CHI TIẾT DUYỆT ĐĂNG KÝ CHƯƠNG TRÌNH"
  );
  cellEventh2.appendChild(cellEventh2Text);

  cellEventdiv2.appendChild(cellEventspan);
  cellEventdiv2.appendChild(cellEventh2);
  cellEventdiv1.appendChild(cellEventdiv2);

  cellEventdiv3 = document.createElement("div");
  cellEventdiv3.classList.add("modal-body");

  cellForm = document.createElement("form");
  cellForm.setAttribute("action", link + "/approved");
  cellForm.setAttribute("method", "get");

  cellEventdiv4 = document.createElement("div");
  cellEventdiv4.classList.add("form-outline");
  cellEventdiv4.classList.add("mb-4");

  cellInput = document.createElement("input");
  cellInput.setAttribute("id", "id");
  cellInput.classList.add("form-control");
  cellInput.setAttribute("type", "hidden");
  cellInput.setAttribute("name", "id");
  cellInput.setAttribute("value", event.id);

  cellEventdiv4.appendChild(cellInput);

  cellForm.appendChild(cellEventdiv4);

  cellEventdiv4 = document.createElement("div");
  cellEventdiv4.classList.add("form-outline");
  cellEventdiv4.classList.add("mb-4");

  cellInput = document.createElement("input");
  cellInput.setAttribute("id", "approved");
  cellInput.classList.add("form-control");
  cellInput.setAttribute("type", "hidden");
  cellInput.setAttribute("name", "approved");
  cellInput.setAttribute("value", "false");

  cellEventdiv4.appendChild(cellInput);

  cellForm.appendChild(cellEventdiv4);

  cellEventdiv4 = document.createElement("div");
  cellEventdiv4.classList.add("form-outline");
  cellEventdiv4.classList.add("mb-4");

  cellInput = document.createElement("input");
  cellInput.setAttribute("id", "name");
  cellInput.classList.add("form-control");
  cellInput.classList.add("active");
  cellInput.setAttribute("type", "text");
  cellInput.setAttribute("value", event.name);
  cellInput.setAttribute("readonly", true);

  cellLabel = document.createElement("label");
  cellLabel.classList.add("form-label");
  cellLabel.setAttribute("for", "name");
  cellLabelText = document.createTextNode("Tên chương trình");
  cellLabel.appendChild(cellLabelText);

  cellEventdiv4.appendChild(cellInput);
  cellEventdiv4.appendChild(cellLabel);

  cellForm.appendChild(cellEventdiv4);

  cellForm.appendChild(cellEventdiv4);

  cellEventdiv4 = document.createElement("div");
  cellEventdiv4.classList.add("form-outline");
  cellEventdiv4.classList.add("mb-4");

  cellInput = document.createElement("input");
  cellInput.setAttribute("id", "support");
  cellInput.classList.add("form-control");
  cellInput.classList.add("active");
  cellInput.setAttribute("type", "text");
  cellInput.setAttribute("value", support);
  cellInput.setAttribute("readonly", true);
  cellInput.setAttribute("name", "support");

  cellLabel = document.createElement("label");
  cellLabel.classList.add("form-label");
  cellLabel.setAttribute("for", "support");
  cellLabelText = document.createTextNode("Mục hỗ trợ");
  cellLabel.appendChild(cellLabelText);

  cellEventdiv4.appendChild(cellInput);
  cellEventdiv4.appendChild(cellLabel);

  cellForm.appendChild(cellEventdiv4);

  cellEventdiv4 = document.createElement("div");
  cellEventdiv4.classList.add("form-outline");
  cellEventdiv4.classList.add("mb-4");

  cellInput = document.createElement("input");
  cellInput.setAttribute("id", "reason");
  cellInput.classList.add("form-control");
  cellInput.classList.add("required");
  cellInput.setAttribute("type", "text");
  cellInput.setAttribute("name", "reason");

  cellLabel = document.createElement("label");
  cellLabel.classList.add("form-label");
  cellLabel.setAttribute("for", "reason");
  cellLabelText = document.createTextNode("Lý do từ chối hỗ trợ");
  cellLabel.appendChild(cellLabelText);

  cellEventdiv4.appendChild(cellInput);
  cellEventdiv4.appendChild(cellLabel);

  cellForm.appendChild(cellEventdiv4);

  cellButton = document.createElement("button");
  cellButton.classList.add("btn");
  cellButton.classList.add("btn-primary");
  cellButton.classList.add("btn-block");
  cellButton.classList.add("mb-4");
  cellButtonText = document.createTextNode("Xác nhận");
  cellButton.appendChild(cellButtonText);

  cellForm.appendChild(cellButton);

  cellEventdiv3.appendChild(cellForm);
  cellEventdiv1.appendChild(cellEventdiv3);
  cellId.appendChild(cellEventdiv1);

  return cellId;
}

function showBlockReply_support(events) {
  block = document.getElementById("blockForm");

  // clearing all things
  block.innerHTML = "";
  for (let index = 0; index < events.length; index++) {
    if (events[index].photo != "none") {
      block.appendChild(showBlockReply_supportTask("Photo", events[index]));
    }
    if (events[index].video != "none") {
      block.appendChild(showBlockReply_supportTask("Video", events[index]));
    }
    if (events[index].livestream != "none") {
      block.appendChild(
        showBlockReply_supportTask("Livestream", events[index])
      );
    }
  }
}

function showListEventAdmin(events) {
  block = document.getElementById("customers");
  var finalText =
    '<table id="customers">' +
    "<tbody>" +
    "<tr>" +
    '<th style="width: 6em; text-align: center">Tên chương trình</th>' +
    '<th style="width: 3em; text-align: center">Người mượn</th>' +
    '<th style="width: 3em; text-align: center">Thời gian bắt đầu</th>' +
    '<th style="width: 3em; text-align: center">Thời gian kết thúc</th>' +
    '<th style="width: 6em; text-align: center">Lý do</th>' +
    '<th style="width: 2em; text-align: center">PDF</th>' +
    '<th style="width: 5em; text-align: center">Kinh phí</th>' +
    '<th style="width: 5em; text-align: center">Trạng thái duyệt</th>' +
    '<th style="width: 4em; text-align: center">Thay đổi</th>' +
    "</tr>";
  var startTime, endTime;

  // clearing all things
  block.innerHTML = "";

  for (let index = 0; index < events.length; index++) {
    startTime = new Date(
      events[index].startTime.slice(0, events[index].startTime.length - 1) +
        "+07:00"
    ).toLocaleString("vi-VN");
    endTime = new Date(
      events[index].endTime.slice(0, events[index].endTime.length - 1) +
        "+07:00"
    ).toLocaleString("vi-VN");

    finalText +=
      "<tr>" +
      '<td id="' +
      events[index]._id +
      '" onclick="toggle(this.id)" style="text-align: center"><u>' +
      events[index].eventID.name +
      "</u></td>" +
      '<td style="text-align: center">' +
      events[index].createdBy.name +
      "</td>" +
      '<td style="text-align: center">' +
      startTime +
      "</td>" +
      '<td style="text-align: center">' +
      endTime +
      "</td>" +
      '<td style="text-align: center">' +
      events[index].eventID.reason +
      "</td>" +
      '<td style="text-align: center">' +
      '<a href="/view?p=' +
      events[index].eventID.file +
      '" target="_blank">' +
      '<img src="/images/eye.svg">' +
      "</a>" +
      "</td>";

    switch (events[index].fee) {
      case "true":
        finalText += '<td style="text-align: center"><u>PTT</u></td>';
        break;

      case "false":
        finalText += '<td style="text-align: center"><u>Đơn vị</u></td>';
        break;

      default:
        finalText += '<td style="text-align: center"><u>Chờ duyệt</u></td>';
        break;
    }

    switch (events[index].approved) {
      case "true":
        finalText +=
          '<td style="text-align: center">Đã duyệt</td><td style="text-align: center"><div onclick="toggleReply(' +
          "'" +
          events[index]._id +
          "'" +
          ')"><img src="/images/decline.svg"></div></td></tr>';
        break;

      case "false":
        finalText +=
          '<td style="text-align: center">Từ chối</td></div><td style="text-align: center"><a href="' +
          link +
          "/approved?id=" +
          events[index]._id +
          '&approved=true"><img src="/images/accept.svg"></a></td></tr>';
        break;

      default:
        finalText +=
          '<td style="text-align: center">Chờ duyệt</td></div>' +
          '<td style="text-align: center"><a href="' +
          link +
          "/approved?id=" +
          events[index]._id +
          '&approved=true"><img src="/images/accept.svg"><div onclick="toggleReply(' +
          "'" +
          events[index]._id +
          "'" +
          ')"><img src="/images/decline.svg"></div></a></td></tr>';
        break;
    }
  }
  finalText += "</tbody></table>";

  block.innerHTML = finalText;
}

function showListEventAdmin_support(events) {
  var finalText =
    '<table id="customers">' +
    "<tbody>" +
    "<tr>" +
    '<th style="width: 6em; text-align: center">Tên chương trình</th>' +
    '<th style="width: 3em; text-align: center">Người mượn</th>' +
    '<th style="width: 3em; text-align: center">Mục hỗ trợ</th>' +
    '<th style="width: 3em; text-align: center">Thời gian bắt đầu</th>' +
    '<th style="width: 3em; text-align: center">Thời gian kết thúc</th>' +
    '<th style="width: 3em; text-align: center">Địa điểm tổ chức</th>' +
    '<th style="width: 6em; text-align: center">Lý do</th>' +
    '<th style="width: 2em; text-align: center">PDF</th>' +
    '<th style="width: 5em; text-align: center">Kinh phí</th>' +
    '<th style="width: 5em; text-align: center">Trạng thái duyệt</th>' +
    '<th style="width: 4em; text-align: center">Thay đổi</th>' +
    "</tr>";
  var startTime, endTime;

  block = document.getElementById("customers");
  // clearing all things
  block.innerHTML = "";

  for (let index = 0; index < events.length; index++) {
    startTime = new Date(
      events[index].startTime.slice(0, events[index].startTime.length - 1) +
        "+07:00"
    ).toLocaleString("vi-VN");
    endTime = new Date(
      events[index].endTime.slice(0, events[index].endTime.length - 1) +
        "+07:00"
    ).toLocaleString("vi-VN");

    var support = [];

    if (events[index].photo != "") {
      support.push("photo");
    }
    if (events[index].video != "") {
      support.push("video");
    }
    if (events[index].livestream != "") {
      support.push("livestream");
    }

    support.forEach((element) => {
      finalText +=
        "<tr>" +
        '<td id="' +
        events[index]._id +
        '" onclick="toggle(this.id)" style="text-align: center"><u>' +
        events[index].eventID.name +
        "</u></td>" +
        '<td style="text-align: center">' +
        events[index].createdBy.name +
        "</td>" +
        '<td style="text-align: center">';

      var approved;

      switch (element) {
        case "photo":
          approved = events[index].photo;
          finalText += "Chụp ảnh";
          break;
        case "video":
          approved = events[index].video;
          finalText += "Quay tư liệu";
          break;
        case "livestream":
          approved = events[index].livestream;
          finalText += "Livestream";
          break;

        default:
          break;
      }
      finalText +=
        '</td><td style="text-align: center">' +
        startTime +
        '</td><td style="text-align: center">' +
        endTime +
        '</td><td style="text-align: center">';

      switch (events[index].eventID.place) {
        case "studio":
          finalText += "Studio";
          break;

        case "ph1":
          finalText += "Phòng họp 1";
          break;

        case "ph2":
          finalText += "Phòng họp 2";
          break;

        case "ph3":
          finalText += "Phòng họp 3";
          break;

        case "grandhall":
          finalText += "Hội trường lớn";
          break;

        default:
          finalText += data[index].eventID.place;
          break;
      }

      finalText +=
        "</td>" +
        '<td style="text-align: center">' +
        events[index].eventID.reason +
        "</td>" +
        '<td style="text-align: center">' +
        '<a href="/view?p=' +
        events[index].eventID.file +
        '" target="_blank">' +
        '<img src="/images/eye.svg">' +
        "</a>" +
        "</td>";

      switch (events[index].fee) {
        case "true":
          finalText += '<td style="text-align: center"><u>PTT</u></td>';
          break;

        case "false":
          finalText += '<td style="text-align: center"><u>Đơn vị</u></td>';
          break;

        default:
          finalText += '<td style="text-align: center"><u>Chờ duyệt</u></td>';
          break;
      }

      switch (approved) {
        case "true":
          finalText +=
            '<td style="text-align: center">Đã duyệt</td><td style="text-align: center"><div onclick="toggleReply(' +
            "'" +
            events[index]._id +
            "'" +
            ')"><img src="/images/decline.svg"></div></td></tr>';
          break;

        case "false":
          finalText +=
            '<td style="text-align: center">Từ chối</td></div><td style="text-align: center"><a href="' +
            link +
            "/approved?id=" +
            events[index]._id +
            "&approved=true&support=" +
            element +
            '"><img src="/images/accept.svg"></a></td></tr>';
          break;

        default:
          finalText +=
            '<td style="text-align: center">Chờ duyệt</td></div>' +
            '<td style="text-align: center"><a href="' +
            link +
            "/approved?id=" +
            events[index]._id +
            "&approved=true&support=" +
            element +
            '"><img src="/images/accept.svg"><div onclick="toggleReply(' +
            "'" +
            events[index]._id +
            "'" +
            ')"><img src="/images/decline.svg"></div></a></td></tr>';
          break;
      }
    });
  }
  finalText += "</tbody></table>";

  block.innerHTML = finalText;
}

function showListAccount(data) {
  block = document.getElementById("customers");
  // clearing all things
  // block.innerHTML = "";

  for (let index = 0; index < data.length; index++) {
    cellEventtr = document.createElement("tr");
    cellEventtr.setAttribute("id", data[index]._id);
    // cellEventtr.setAttribute("onClick", "toggle(this.id)");

    cellEventtd = document.createElement("td");
    cellEventtdText = document.createTextNode(data[index].name);
    cellEventtd.appendChild(cellEventtdText);
    cellEventtr.appendChild(cellEventtd);

    cellEventtd = document.createElement("td");
    cellEventtdText = document.createTextNode(data[index].userID.unitName);
    cellEventtd.appendChild(cellEventtdText);
    cellEventtr.appendChild(cellEventtd);

    cellEventtd = document.createElement("td");
    cellEventtdText = document.createTextNode(data[index].email);
    cellEventtd.appendChild(cellEventtdText);
    cellEventtr.appendChild(cellEventtd);

    cellEventtd = document.createElement("td");
    cellEventtdText = document.createTextNode(data[index].userID.phone);
    cellEventtd.appendChild(cellEventtdText);
    cellEventtr.appendChild(cellEventtd);

    cellEventtd = document.createElement("td");
    cellEventtd.setAttribute("style", "text-align: center");
    cellEventa = document.createElement("a");
    cellEventa.setAttribute("href", "api/account/reset?id=" + data[index]._id);
    cellEventaText = document.createTextNode("Reset");
    cellEventa.appendChild(cellEventaText);
    cellEventtd.appendChild(cellEventa);
    cellEventtr.appendChild(cellEventtd);

    cellEventtd = document.createElement("td");
    cellEventtd.setAttribute("style", "text-align: center");
    cellEventa = document.createElement("a");
    cellEventa.setAttribute("href", "#");
    cellEventaText = document.createTextNode("Edit");
    cellEventa.appendChild(cellEventaText);
    cellEventtd.appendChild(cellEventa);
    cellEventtr.appendChild(cellEventtd);

    block.appendChild(cellEventtr);
  }
}

// check how many days in a month code from https://dzone.com/articles/determining-number-days-month
function daysInMonth(iMonth, iYear) {
  return 32 - new Date(iYear, iMonth, 32).getDate();
}
