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

  return text;
}

function next() {
  currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth + 1) % 12;

  showCalendar(currentMonth, currentYear);

  var eventData = fetchAPI(
    "/api/" + link + "?month=" + (currentMonth + 1).toString()
  );

  eventData.then((data) => {
    showBlockEvent(data);
    if (link == "support") {
      showEventInCalendarSupport(data, currentMonth, currentYear);
    } else {
      showEventInCalendar(data, currentMonth, currentYear);
    }
  });
}

function previous() {
  currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;

  showCalendar(currentMonth, currentYear);

  var eventData = fetchAPI(
    "/api/" + link + "?month=" + (currentMonth + 1).toString()
  );

  eventData.then((data) => {
    showBlockEvent(data);
    if (link == "support") {
      showEventInCalendarSupport(data, currentMonth, currentYear);
    } else {
      showEventInCalendar(data, currentMonth, currentYear);
    }
  });
}

function jump() {
  currentYear = parseInt(selectYear.value);
  currentMonth = parseInt(selectMonth.value);

  showCalendar(currentMonth, currentYear);

  var eventData = fetchAPI(
    "/api/" + link + "?month=" + (currentMonth + 1).toString()
  );

  eventData.then((data) => {
    showBlockEvent(data);
    if (link == "support") {
      showEventInCalendarSupport(data, currentMonth, currentYear);
    } else {
      showEventInCalendar(data, currentMonth, currentYear);
    }
  });
}

function showCalendar(month, year) {
  let firstDay = new Date(year, month).getDay();

  tbl = document.getElementById("calendar-body"); // body of the calendar

  // clearing all previous cells
  tbl.innerHTML = "";

  // filing data about month and in the page via DOM.
  monthAndYear.innerHTML = months[month] + "<br>" + year;
  selectYear.value = year;
  selectMonth.value = month;

  // creating all cells
  let date = 1;

  for (let i = 0; i < 6; i++) {
    // creates a table row
    let row = document.createElement("tr");

    //creating individual cells, filing them up with data.
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        cell = document.createElement("td");
        cell.classList.add("none-day");
        cellText = document.createTextNode("");
        cell.appendChild(cellText);

        cellInfo = document.createElement("span");
        cellInfo.setAttribute(
          "id",
          "dateLastMonth" + (daysInMonth(month - 1, year) - firstDay + 1 + j)
        );
        cellInfo.classList.add("date");
        cellInfoText = document.createTextNode(
          daysInMonth(month - 1, year) - firstDay + 1 + j
        );
        cellInfo.appendChild(cellInfoText);

        cell.appendChild(cellInfo);
        row.appendChild(cell);
      } else if (date > daysInMonth(month, year) && j == 0) {
        break;
      } else if (date > daysInMonth(month, year)) {
        cell = document.createElement("td");
        cell.classList.add("none-day");
        cellText = document.createTextNode("");
        cell.appendChild(cellText);

        cellInfo = document.createElement("span");
        cellInfo.setAttribute(
          "id",
          "dateNextMonth" + (date - daysInMonth(month, year))
        );
        cellInfo.classList.add("date");
        cellInfoText = document.createTextNode(date - daysInMonth(month, year));
        cellInfo.appendChild(cellInfoText);

        cell.appendChild(cellInfo);
        row.appendChild(cell);

        date++;
      } else {
        cell = document.createElement("td");
        if (j === 0 || j === 6) {
          cell.classList.add("weekend");
        }
        cell.setAttribute("id", "date" + date);

        cellText = document.createTextNode("");

        if (
          date === today.getDate() &&
          year === today.getFullYear() &&
          month === today.getMonth()
        ) {
          cell.classList.add("current-day");
        } // color today's date

        cell.appendChild(cellText);

        cellInfo = document.createElement("span");
        cellInfo.setAttribute("id", "date" + date);
        cellInfo.classList.add("date");
        cellInfoText = document.createTextNode(date);
        cellInfo.appendChild(cellInfoText);
        cellEventul = document.createElement("ul");

        cell.appendChild(cellInfo);

        row.appendChild(cell);
        date++;
      }
      tbl.appendChild(row); // appending each row into calendar body.
    }
  }
}

function showEventInCalendar(events, month, year) {
  for (let index = 0; index < events.length; index++) {
    var startTime = new Date(
      events[index].startTime.slice(0, events[index].startTime.length - 1) +
        "+07:00"
    );
    var endTime = new Date(
      events[index].endTime.slice(0, events[index].endTime.length - 1) +
        "+07:00"
    );

    var name = limitText(events[index].eventID.name, 15);

    if (startTime.getMonth() == endTime.getMonth()) {
      for (
        let index2 = 0;
        index2 <= endTime.getDate() - startTime.getDate();
        index2++
      ) {
        var status = "";
        var date = startTime.getDate() + index2;

        if (month < today.getMonth()) {
          status = " old";
        } else if (
          startTime.getMonth() == today.getMonth() &&
          date < today.getDate()
        ) {
          status = " old";
        } else if (
          startTime.getMonth() < today.getMonth() &&
          date < today.getDate()
        ) {
          status = " old";
        }

        tbl = document.getElementById("date" + date);
        var text = tbl.innerHTML;
        var textFinal;

        if (text.match("</ul></span>") != null) {
          textFinal =
            text.slice(0, text.match("</ul></span>").index) +
            '<li id="' +
            events[index]._id +
            '" class="reminder' +
            status +
            '" onclick="toggle(this.id)">' +
            '<div class="memo">' +
            '<div class="time">' +
            convertTime(
              startTime.getHours(),
              startTime.getMinutes(),
              endTime.getHours(),
              endTime.getMinutes()
            ) +
            "</div>" +
            '<div class="event">' +
            name +
            "</div>" +
            "</div>" +
            "</li>" +
            "</ul>" +
            "</span>";
        } else {
          textFinal =
            text.slice(0, text.match("</span>").index) +
            "<ul>" +
            '<li id="' +
            events[index]._id +
            '" class="reminder' +
            status +
            '" onclick="toggle(this.id)">' +
            '<div class="memo">' +
            '<div class="time">' +
            convertTime(
              startTime.getHours(),
              startTime.getMinutes(),
              endTime.getHours(),
              endTime.getMinutes()
            ) +
            "</div>" +
            '<div class="event">' +
            name +
            "</div>" +
            "</div>" +
            "</li>" +
            "</ul>" +
            "</span>";
        }

        tbl.innerHTML = textFinal;
      }
    } else if (startTime.getMonth() < endTime.getMonth()) {
      if (endTime.getMonth() == month) {
        for (let index2 = 0; index2 <= endTime.getDate(); index2++) {
          var status = "";
          var date = 1 + index2;

          if (month < today.getMonth()) {
            status = " old";
          } else if (
            startTime.getMonth() == today.getMonth() &&
            date < today.getDate()
          ) {
            status = " old";
          } else if (
            startTime.getMonth() < today.getMonth() &&
            date < today.getDate()
          ) {
            status = " old";
          }

          tbl = document.getElementById("date" + date);
          var text = tbl.innerHTML;
          var textFinal;

          if (text.match("</ul></span>") != null) {
            textFinal =
              text.slice(0, text.match("</ul></span>").index) +
              '<li id="' +
              events[index]._id +
              '" class="reminder' +
              status +
              '" onclick="toggle(this.id)">' +
              '<div class="memo">' +
              '<div class="time">' +
              convertTime(
                startTime.getHours(),
                startTime.getMinutes(),
                endTime.getHours(),
                endTime.getMinutes()
              ) +
              "</div>" +
              '<div class="event">' +
              name +
              "</div>" +
              "</div>" +
              "</li>" +
              "</ul>" +
              "</span>";
          } else {
            textFinal =
              text.slice(0, text.match("</span>").index) +
              "<ul>" +
              '<li id="' +
              events[index]._id +
              '" class="reminder' +
              status +
              '" onclick="toggle(this.id)">' +
              '<div class="memo">' +
              '<div class="time">' +
              convertTime(
                startTime.getHours(),
                startTime.getMinutes(),
                endTime.getHours(),
                endTime.getMinutes()
              ) +
              "</div>" +
              '<div class="event">' +
              name +
              "</div>" +
              "</div>" +
              "</li>" +
              "</ul>" +
              "</span>";
          }

          tbl.innerHTML = textFinal;
        }
      } else if (startTime.getMonth() == month) {
        for (
          let index2 = startTime.getDate();
          index2 <= daysInMonth(month, year);
          index2++
        ) {
          var status = "";
          var date = index2;

          if (month < today.getMonth()) {
            status = " old";
          } else if (
            startTime.getMonth() == today.getMonth() &&
            date < today.getDate()
          ) {
            status = " old";
          } else if (
            startTime.getMonth() < today.getMonth() &&
            date < today.getDate()
          ) {
            status = " old";
          }

          tbl = document.getElementById("date" + date);
          var text = tbl.innerHTML;
          var textFinal;

          if (text.match("</ul></span>") != null) {
            textFinal =
              text.slice(0, text.match("</ul></span>").index) +
              '<li id="' +
              events[index]._id +
              '" class="reminder' +
              status +
              '" onclick="toggle(this.id)">' +
              '<div class="memo">' +
              '<div class="time">' +
              convertTime(
                startTime.getHours(),
                startTime.getMinutes(),
                endTime.getHours(),
                endTime.getMinutes()
              ) +
              "</div>" +
              '<div class="event">' +
              name +
              "</div>" +
              "</div>" +
              "</li>" +
              "</ul>" +
              "</span>";
          } else {
            textFinal =
              text.slice(0, text.match("</span>").index) +
              "<ul>" +
              '<li id="' +
              events[index]._id +
              '" class="reminder' +
              status +
              '" onclick="toggle(this.id)">' +
              '<div class="memo">' +
              '<div class="time">' +
              convertTime(
                startTime.getHours(),
                startTime.getMinutes(),
                endTime.getHours(),
                endTime.getMinutes()
              ) +
              "</div>" +
              '<div class="event">' +
              name +
              "</div>" +
              "</div>" +
              "</li>" +
              "</ul>" +
              "</span>";
          }

          tbl.innerHTML = textFinal;
        }
      }
    }
  }
}

function showEventInCalendarSupport(events, month, year) {
  for (let index = 0; index < events.length; index++) {
    var startTime = new Date(
      events[index].startTime.slice(0, events[index].startTime.length - 1) +
        "+07:00"
    );
    var endTime = new Date(
      events[index].endTime.slice(0, events[index].endTime.length - 1) +
        "+07:00"
    );

    var support = [];

    if (events[index].photo == "true") {
      support.push("photo");
    }
    if (events[index].video == "true") {
      support.push("video");
    }
    if (events[index].livestream == "true") {
      support.push("livestream");
    }

    var name = limitText(events[index].eventID.name, 15);

    support.forEach((element) => {
      if (startTime.getMonth() == endTime.getMonth()) {
        for (
          let index2 = 0;
          index2 <= endTime.getDate() - startTime.getDate();
          index2++
        ) {
          var status = " " + element;
          var date = startTime.getDate() + index2;

          if (month < today.getMonth()) {
            status = " old";
          } else if (
            startTime.getMonth() == today.getMonth() &&
            date < today.getDate()
          ) {
            status = " old";
          } else if (
            startTime.getMonth() < today.getMonth() &&
            date < today.getDate()
          ) {
            status = " old";
          }

          tbl = document.getElementById("date" + date);
          var text = tbl.innerHTML;
          var textFinal;

          if (text.match("</ul></span>") != null) {
            textFinal =
              text.slice(0, text.match("</ul></span>").index) +
              '<li id="' +
              events[index]._id +
              '" class="reminder' +
              status +
              '" onclick="toggle(this.id)">' +
              '<div class="memo">' +
              '<div class="time">' +
              convertTime(
                startTime.getHours(),
                startTime.getMinutes(),
                endTime.getHours(),
                endTime.getMinutes()
              ) +
              "</div>" +
              '<div class="event">' +
              name +
              "</div>" +
              "</div>" +
              "</li>" +
              "</ul>" +
              "</span>";
          } else {
            textFinal =
              text.slice(0, text.match("</span>").index) +
              "<ul>" +
              '<li id="' +
              events[index]._id +
              '" class="reminder' +
              status +
              '" onclick="toggle(this.id)">' +
              '<div class="memo">' +
              '<div class="time">' +
              convertTime(
                startTime.getHours(),
                startTime.getMinutes(),
                endTime.getHours(),
                endTime.getMinutes()
              ) +
              "</div>" +
              '<div class="event">' +
              name +
              "</div>" +
              "</div>" +
              "</li>" +
              "</ul>" +
              "</span>";
          }

          tbl.innerHTML = textFinal;
        }
      } else if (startTime.getMonth() < endTime.getMonth()) {
        if (endTime.getMonth() == month) {
          for (let index2 = 0; index2 <= endTime.getDate(); index2++) {
            var status = "";
            var date = 1 + index2;

            if (month < today.getMonth()) {
              status = " old";
            } else if (
              startTime.getMonth() == today.getMonth() &&
              date < today.getDate()
            ) {
              status = " old";
            } else if (
              startTime.getMonth() < today.getMonth() &&
              date < today.getDate()
            ) {
              status = " old";
            }

            tbl = document.getElementById("date" + date);
            var text = tbl.innerHTML;
            var textFinal;

            if (text.match("</ul></span>") != null) {
              textFinal =
                text.slice(0, text.match("</ul></span>").index) +
                '<li id="' +
                events[index]._id +
                '" class="reminder' +
                status +
                '" onclick="toggle(this.id)">' +
                '<div class="memo">' +
                '<div class="time">' +
                convertTime(
                  startTime.getHours(),
                  startTime.getMinutes(),
                  endTime.getHours(),
                  endTime.getMinutes()
                ) +
                "</div>" +
                '<div class="event">' +
                name +
                "</div>" +
                "</div>" +
                "</li>" +
                "</ul>" +
                "</span>";
            } else {
              textFinal =
                text.slice(0, text.match("</span>").index) +
                "<ul>" +
                '<li id="' +
                events[index]._id +
                '" class="reminder ' +
                status +
                '" onclick="toggle(this.id)">' +
                '<div class="memo">' +
                '<div class="time">' +
                convertTime(
                  startTime.getHours(),
                  startTime.getMinutes(),
                  endTime.getHours(),
                  endTime.getMinutes()
                ) +
                "</div>" +
                '<div class="event">' +
                name +
                "</div>" +
                "</div>" +
                "</li>" +
                "</ul>" +
                "</span>";
            }

            tbl.innerHTML = textFinal;
          }
        } else if (startTime.getMonth() == month) {
          for (
            let index2 = startTime.getDate();
            index2 <= daysInMonth(month, year);
            index2++
          ) {
            var status = " " + element;
            var date = index2;

            if (month < today.getMonth()) {
              status = " old";
            } else if (
              startTime.getMonth() == today.getMonth() &&
              date < today.getDate()
            ) {
              status = " old";
            } else if (
              startTime.getMonth() < today.getMonth() &&
              date < today.getDate()
            ) {
              status = " old";
            }

            tbl = document.getElementById("date" + date);
            var text = tbl.innerHTML;
            var textFinal;

            if (text.match("</ul></span>") != null) {
              textFinal =
                text.slice(0, text.match("</ul></span>").index) +
                '<li id="' +
                events[index]._id +
                '" class="reminder' +
                status +
                '" onclick="toggle(this.id)">' +
                '<div class="memo">' +
                '<div class="time">' +
                convertTime(
                  startTime.getHours(),
                  startTime.getMinutes(),
                  endTime.getHours(),
                  endTime.getMinutes()
                ) +
                "</div>" +
                '<div class="event">' +
                name +
                "</div>" +
                "</div>" +
                "</li>" +
                "</ul>" +
                "</span>";
            } else {
              textFinal =
                text.slice(0, text.match("</span>").index) +
                "<ul>" +
                '<li id="' +
                events[index]._id +
                '" class="reminder' +
                status +
                '" onclick="toggle(this.id)">' +
                '<div class="memo">' +
                '<div class="time">' +
                convertTime(
                  startTime.getHours(),
                  startTime.getMinutes(),
                  endTime.getHours(),
                  endTime.getMinutes()
                ) +
                "</div>" +
                '<div class="event">' +
                name +
                "</div>" +
                "</div>" +
                "</li>" +
                "</ul>" +
                "</span>";
            }

            tbl.innerHTML = textFinal;
          }
        }
      }
    });
  }
}

function showBlockEvent(data) {
  block = document.getElementById("blockEvents");

  // clearing all things
  block.innerHTML = "";

  var text = "";

  for (let index = 0; index < data.length; index++) {
    var personOnDuty = {};
    var support = "";

    if (data[index].eventID.place == "studio") {
      personOnDuty.name = "Trần Đông Cal";
      personOnDuty.phone = "0973496024";
      personOnDuty.email = "caltd@hcmute.edu.vn";
    } else {
      personOnDuty.name = "Trần Đông Cal";
      personOnDuty.phone = "0973496024";
      personOnDuty.email = "caltd@hcmute.edu.vn";
    }

    if (data[index].photo == "true") {
      if (support.length != 0) {
        support += ", ";
      }
      support += "Chụp ảnh";
    } else if (data[index].photo == "waiting") {
      if (support.length != 0) {
        support += ", ";
      }
      support += "Chụp ảnh (Chờ duyệt)";
    }
    if (data[index].video == "true") {
      if (support.length != 0) {
        support += ", ";
      }
      support += "Quay tư liệu";
    } else if (data[index].video == "waiting") {
      if (support.length != 0) {
        support += ", ";
      }
      support += "Quay tư liệu (Chờ duyệt)";
    }
    if (data[index].livestream == "true") {
      if (support.length != 0) {
        support += ", ";
      }
      support += "Livestream";
    } else if (data[index].livestream == "waiting") {
      if (support.length != 0) {
        support += ", ";
      }
      support += "Livestream (Chờ duyệt)";
    }

    var startTime = new Date(
      data[index].startTime.slice(0, data[index].startTime.length - 1) +
        "+07:00"
    ).toLocaleString("vi-VN");

    var endTime = new Date(
      data[index].endTime.slice(0, data[index].endTime.length - 1) + "+07:00"
    ).toLocaleString("vi-VN");

    var createdOn = new Date(
      data[index].eventID.createdOn.slice(
        0,
        data[index].eventID.createdOn.length - 1
      ) + "+07:00"
    ).toLocaleString("vi-VN");

    var approvedOn = new Date(
      data[index].approvedOn.slice(0, data[index].approvedOn.length - 1) +
        "+07:00"
    ).toLocaleString("vi-VN");

    text +=
      '<div id="pmo' +
      data[index]._id +
      '" class="modal" style="display: none;"><div class="modal-content"><div class="modal-header"><span id="pmo' +
      data[index]._id +
      '" class="close">×</span><h2>CHI TIẾT MƯỢN</h2></div><div class="modal-body"><table id="customers"><tr><td><b>Tên chương trình</b></td><td>' +
      data[index].eventID.name +
      "</td></tr><tr><td><b>Người mượn</b></td><td>" +
      data[index].eventID.responsible +
      "</td></tr><tr><td><b>Số điện thoại</b></td><td>" +
      data[index].eventID.phone +
      "</td></tr><tr><td><b>Nơi đăng ký</b></td><td>";

    switch (data[index].eventID.place) {
      case "studio":
        text += "Studio";
        break;

      case "ph1":
        text += "Phòng họp 1";
        break;

      case "ph2":
        text += "Phòng họp 2";
        break;

      case "ph3":
        text += "Phòng họp 3";
        break;

      case "grandhall":
        text += "Hội trường lớn";
        break;

      default:
        text += data[index].eventID.place;
        break;
    }

    if (support.length != 0) {
      text += "</td></tr><tr><td><b>Mục hỗ trợ</b></td><td>" + support;
    }

    text +=
      "</td></tr><tr><td><b>Thời gian bắt đầu</b></td><td>" +
      startTime +
      "</td></tr><tr><td><b>Thời gian kết thúc</b></td><td>" +
      endTime +
      "</td></tr><tr><td><b>Lý do mượn</b></td><td>" +
      data[index].eventID.reason +
      "</td></tr><tr><td><b>Người đăng ký</b></td><td>" +
      data[index].createdBy.name +
      "</td></tr><tr><td><b>Thời gian đăng ký</b></td><td>" +
      createdOn +
      "</td></tr><tr><td><b>Người xác nhận</b></td><td>" +
      data[index].approvedBy.name +
      "</td></tr><tr><td><b>Xác nhận lúc</b></td><td>" +
      approvedOn +
      "</td></tr><tr><td><b>Người trực</b></td><td>" +
      personOnDuty.name +
      "</td></tr><tr><td><b>Điện thoại liên hệ</b></td><td>" +
      personOnDuty.phone +
      "</td></tr><tr><td><b>Email liên hệ</b></td><td>" +
      personOnDuty.email +
      '</td></tr><tr><td><b>Kế hoạch</b></td><td><a href="/view?p=' +
      data[index].eventID.file +
      '" target="_blank"><img src="/images/eye.svg"></a></td></tr></table></div></div></div>';
  }

  block.innerHTML += text;
}

function showListEvent(events, status) {
  block = document.getElementById("customers");

  // clearing all things
  // block.innerHTML = "";

  for (let index = 0; index < events.length; index++) {
    cellEventtr = document.createElement("tr");

    cellEventtd = document.createElement("td");
    text = convertFullTime(
      events[index].createdOn.hour,
      events[index].createdOn.minute,
      events[index].createdOn.date,
      events[index].createdOn.month,
      events[index].createdOn.year
    );
    cellEventtdText = document.createTextNode(text);
    cellEventtd.appendChild(cellEventtdText);
    cellEventtr.appendChild(cellEventtd);

    cellEventtd = document.createElement("td");
    cellEventtdText = document.createTextNode(events[index].name);
    cellEventtd.appendChild(cellEventtdText);
    cellEventtr.appendChild(cellEventtd);

    cellEventtd = document.createElement("td");
    cellEventtdText = document.createTextNode(events[index].createdBy);
    cellEventtd.appendChild(cellEventtdText);
    cellEventtr.appendChild(cellEventtd);

    cellEventtd = document.createElement("td");
    text = convertFullTime(
      events[index].startTime.hour,
      events[index].startTime.minute,
      events[index].startTime.date,
      events[index].startTime.month,
      events[index].startTime.year
    );
    cellEventtdText = document.createTextNode(text);
    cellEventtd.appendChild(cellEventtdText);
    cellEventtr.appendChild(cellEventtd);

    cellEventtd = document.createElement("td");
    text = convertFullTime(
      events[index].endTime.hour,
      events[index].endTime.minute,
      events[index].endTime.date,
      events[index].endTime.month,
      events[index].endTime.year
    );
    cellEventtdText = document.createTextNode(text);
    cellEventtd.appendChild(cellEventtdText);
    cellEventtr.appendChild(cellEventtd);

    cellEventtd = document.createElement("td");
    cellEventtdText = document.createTextNode(events[index].reason);
    cellEventtd.appendChild(cellEventtdText);
    cellEventtr.appendChild(cellEventtd);

    cellEventtd = document.createElement("td");
    cellEventimg = document.createElement("img");
    cellEventimg.setAttribute("src", "/images/eye.svg");
    cellEventimg.setAttribute("href", "/view?p=" + events[index].file);
    cellEventimg.setAttribute("target", "_blank");
    cellEventtd.appendChild(cellEventimg);
    cellEventtr.appendChild(cellEventtd);

    if (status == "true") {
      cellEventtd = document.createElement("td");
      cellEventtdText = document.createTextNode("Đã duyệt");
      cellEventtd.appendChild(cellEventtdText);
      cellEventtr.appendChild(cellEventtd);
    } else {
      cellEventtd = document.createElement("td");
      cellEventtdText = document.createTextNode("Chờ duyệt");
      cellEventtd.appendChild(cellEventtdText);
      cellEventtr.appendChild(cellEventtd);
    }

    block.appendChild(cellEventtr);
  }
}

function showListEvent(events) {
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
          '<td style="text-align: center">Đã duyệt</td><td></td></tr>';
        break;

      case "false":
        finalText +=
          '<td style="text-align: center">Từ chối</td><td></td></tr>';
        break;

      default:
        finalText +=
          '<td style="text-align: center">Chờ duyệt</td><td></td></tr>';
        break;
    }
  }
  finalText += "</tbody></table>";

  block.innerHTML = finalText;
}

// check how many days in a month code from https://dzone.com/articles/determining-number-days-month
function daysInMonth(iMonth, iYear) {
  return 32 - new Date(iYear, iMonth, 32).getDate();
}

function limitText(limitField, limitNum) {
  if (limitField.length > limitNum) {
    limitField = limitField.substring(0, limitNum) + "...";
  }

  return limitField;
}
