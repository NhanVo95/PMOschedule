const db = require("./database"),
  fs = require("fs"),
  csv = require("csv-parser"),
  path = require("path");

// module.exports.dbAdmininit = async function () {
//   db.register(
//     "Lê Việt Tiên",
//     "viettien@hcmute.edu.vn",
//     "pmo@123",
//     "admin",
//     "true",
//     "0985188457",
//     "Press and Media Office",
//     "Deputy Head",
//     "NhanVo"
//   );
//   db.register(
//     "Phòng Truyền thông",
//     "pmo@hcmute.edu.vn",
//     "pmo@123",
//     "admin",
//     "false",
//     "0123456789",
//     "Press and Media Office",
//     "Office",
//     "NhanVo"
//   );
//   db.register(
//     "Võ Thành Nhân",
//     "nhanvt@hcmute.edu.vn",
//     "pmo@123",
//     "admin",
//     "false",
//     "0967619672",
//     "Press and Media Office",
//     "Employee",
//     "NhanVo"
//   );
//   db.register(
//     "Trần Đông Cal",
//     "caltd@hcmute.edu.vn",
//     "pmo@123",
//     "admin",
//     "false",
//     "0973496024",
//     "Press and Media Office",
//     "Employee",
//     "NhanVo"
//   );
//   db.register(
//     "Phan Thị Thanh Nhi",
//     "nhiptt@hcmute.edu.vn",
//     "pmo@123",
//     "admin",
//     "false",
//     "0394362236",
//     "Press and Media Office",
//     "Employee",
//     "NhanVo"
//   );
//   db.register(
//     "Trương Thị Kim Ngân",
//     "nganttk@hcmute.edu.vn",
//     "pmo@123",
//     "admin",
//     "false",
//     "0937988866",
//     "Press and Media Office",
//     "Employee",
//     "NhanVo"
//   );
//   db.register(
//     "nguyễn Hoàng Tú",
//     "hoangtu@hcmute.edu.vn",
//     "pmo@123",
//     "admin",
//     "false",
//     "0372443714",
//     "Press and Media Office",
//     "Employee",
//     "NhanVo"
//   );
// };

// module.exports.dbinit = async function () {
//   db.register(
//     "Trương Thị Hiền",
//     "hientt@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0888896699",
//     "Board of Presidents",
//     "Deputy President",
//     "NhanVo"
//   );
//   db.register(
//     "Lê Hiếu Giang",
//     "gianglh@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0938308141",
//     "Board of Presidents",
//     "Deputy President",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Thanh Giang",
//     "giangnt@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0913605184",
//     "Dormitory Management",
//     "Deputy Head",
//     "NhanVo"
//   );
//   db.register(
//     "Hồ Anh Kiệt",
//     "hakiet@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0903964100",
//     "Dormitory Management",
//     "Deputy Head",
//     "NhanVo"
//   );
//   db.register(
//     "Hồ Thành Công",
//     "conght@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0908206491",
//     "Dormitory Management",
//     "Head",
//     "NhanVo"
//   );
//   db.register(
//     "Thái Lương Thụ",
//     "thutl@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0909972845",
//     "Project Management Department",
//     "Deputy Head",
//     "NhanVo"
//   );
//   db.register(
//     "Phạm Minh Đăng",
//     "danghcmute@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0903388899",
//     "Project Management Department",
//     "Head",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Thị Phượng",
//     "ntphuong@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0989247288",
//     "Faculty of Political Science and Law",
//     "Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Phùng Thế Anh",
//     "anhpt@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0919222455",
//     "Faculty of Political Science and Law",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Phạm Sơn Minh",
//     "minhps@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0938226313",
//     "Faculty of Mechanical Engineering",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Trường Thịnh",
//     "thinhnt@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0903675673",
//     "Faculty of Mechanical Engineering",
//     "Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Quách Văn Thiêm",
//     "thiemqv@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0934144256",
//     "Faculty of Mechanical Engineering",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Trương Nguyễn Luân Vũ",
//     "vuluantn@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0909011136",
//     "Faculty of Mechanical Engineering",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Văn Trạng",
//     "trangnv@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0935705017",
//     "Faculty of Vehicle and Energy Engineering",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Huỳnh Phước Sơn",
//     "sonhp@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0903639216",
//     "Faculty of Vehicle and Energy Engineering",
//     "Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Đỗ Quốc Ấm",
//     "amdq@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0913120175",
//     "Faculty of Vehicle and Energy Engineering",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Lê Minh Nhựt",
//     "nhutlm@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0978446968",
//     "Faculty of Vehicle and Energy Engineering",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Thị Tịnh Ấu",
//     "tinhau@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0909098536",
//     "Faculty of Chemical and Food Technology",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Trịnh Khánh Sơn",
//     "sontk@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0935133734",
//     "Faculty of Chemical and Food Technology",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Tấn Dũng",
//     "tandzung072@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0918801670",
//     "Faculty of Chemical and Food Technology",
//     "Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Trần Công Tú",
//     "tutc@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0983674375",
//     "Faculty of Information Technology",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Lê Vĩnh Thịnh",
//     "thinhlv@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0938252222",
//     "Faculty of Information Technology",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Lê Văn Vinh",
//     "vinhlv@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0915755166",
//     "Faculty of Information Technology",
//     "Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Văn Long Giang",
//     "giangckd@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0903175378",
//     "Faculty for High Quality Training",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Đăng Quang",
//     "quangnd@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0903660728",
//     "Faculty for High Quality Training",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Bùi Xuân Dũng",
//     "dungbx@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0337894899",
//     "Faculty for High Quality Training",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Lê Thanh Phúc",
//     "phuclt@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0932591200",
//     "Faculty for High Quality Training",
//     "Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Dương Tuấn Tùng",
//     "tungdt@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0914805623",
//     "Faculty of International Education",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Trương Đình Nhơn",
//     "nhontd@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0903675119",
//     "Faculty of International Education",
//     "Acting Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Thới",
//     "thoinguyen@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0982612805",
//     "Faculty of International Education",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Lê Chí Kiên",
//     "kienlc@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0987673030",
//     "Faculty of Electrical and Electronics Engineering",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Lê Mỹ Hà",
//     "halm@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0938 811201",
//     "Faculty of Electrical and Electronics Engineering",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Minh Tâm",
//     "tamnm@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0902873941",
//     "Faculty of Electrical and Electronics Engineering",
//     "Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Long Giang",
//     "giangnl@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0903678610",
//     "Faculty of Graphic Arts and Media",
//     "Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Lê Công Danh",
//     "danhlc@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0903344837",
//     "Faculty of Graphic Arts and Media",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Trần Tuấn Anh",
//     "anhtt@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0966858277",
//     "Faculty of Applied Sciences",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Phan Gia Anh Vũ",
//     "vuphan@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0907542597",
//     "Faculty of Applied Sciences",
//     "Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Khắc Hiếu",
//     "hieunk@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0903022650",
//     "Faculty of Economics",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Đàng Quang Vắng",
//     "vangdq@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0902324119",
//     "Faculty of Economics",
//     "Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Lê Trường Diễm Trang",
//     "trangltd@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0903334975",
//     "Faculty of Economics",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Lê Phương Anh",
//     "anhlp@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0989071934",
//     "Faculty of Foreign Languages",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Đặng Tấn Tín",
//     "tin.dang@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0909222504",
//     "Faculty of Foreign Languages",
//     "Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Tuấn Anh",
//     "nta@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0934061793",
//     "Faculty of Fashion and Tourism",
//     "Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Thành Hậu",
//     "haunt@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0918410041",
//     "Faculty of Fashion and Tourism",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Thị Thúy",
//     "nguyenthuy@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0909 325 648",
//     "Faculty of Fashion and Tourism",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Trần Vũ Tự",
//     "tutv@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0931282881",
//     "Faculty of Civil Engineering",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Trần Văn Tiếng",
//     "tiengtv@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0906792527",
//     "Faculty of Civil Engineering",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Châu Đình Thành",
//     "chdthanh@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0903092979",
//     "Faculty of Civil Engineering",
//     "Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Phạm Huy Tuân",
//     "phtuan@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0919636515",
//     "Quality Assurance Office",
//     "Acting Head",
//     "NhanVo"
//   );
//   db.register(
//     "Phan Thị Thu Thủy",
//     "thuyptt@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0903130454",
//     "Quality Assurance Office",
//     "Deputy Head",
//     "NhanVo"
//   );
//   db.register(
//     "Phạm Thị Thu Sương",
//     "suongptt@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0933951041",
//     "Academic Affairs Office",
//     "Deputy Head",
//     "NhanVo"
//   );
//   db.register(
//     "Huỳnh Tôn Nghĩa",
//     "nghiaht@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0933263595",
//     "Academic Affairs Office",
//     "Deputy Head",
//     "NhanVo"
//   );
//   db.register(
//     "Quách Thanh Hải",
//     "haiqt@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0903.688.130",
//     "Academic Affairs Office",
//     "Head",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Thị Kim Cúc",
//     "cucntk@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0908617234",
//     "Non-Official Academic Affairs Office",
//     "Deputy Head",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Thanh Phong",
//     "phongnt@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0912088830",
//     "Non-Official Academic Affairs Office",
//     "Deputy Head",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Hùng Thái",
//     "thainh@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0982639999",
//     "Finance and Planning Office",
//     "Head",
//     "NhanVo"
//   );
//   db.register(
//     "Hoàng Thị Lan Hương",
//     "huonghtl@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0966896239",
//     "Finance and Planning Office",
//     "Deputy Head",
//     "NhanVo"
//   );
//   db.register(
//     "Hoàng An Quốc",
//     "hanquoc@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0908197416",
//     "Science Technology and International Affairs Office",
//     "Head",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Vũ Lân",
//     "lannv@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0913522142",
//     "Science Technology and International Affairs Office",
//     "Deputy Head",
//     "NhanVo"
//   );
//   db.register(
//     "Lê Tấn Cường",
//     "cuonglt@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0909744100",
//     "Science Technology and International Affairs Office",
//     "Deputy Head",
//     "NhanVo"
//   );
//   db.register(
//     "Đỗ Thành Trung",
//     "trungdt@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0989881588",
//     "Science Technology and International Affairs Office",
//     "Deputy Head",
//     "NhanVo"
//   );
//   db.register(
//     "Phạm Hữu Thái",
//     "thaiph@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0985935569",
//     "Enterprises Relation Office",
//     "Head",
//     "NhanVo"
//   );
//   db.register(
//     "Đặng Bá Ngoạn",
//     "ngoandb@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0984040611",
//     "Enterprises Relation Office",
//     "Deputy Head",
//     "NhanVo"
//   );
//   db.register(
//     "Trần Kế Thuận",
//     "thuantk@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0969069009",
//     "Facility Management Office",
//     "Acting Head",
//     "NhanVo"
//   );
//   db.register(
//     "Lê Thị Hải Lý",
//     "lylth@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0919408083",
//     "Facility Management Office",
//     "Deputy Head",
//     "NhanVo"
//   );
//   db.register(
//     "Trần Quang Sang",
//     "sangtq@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0919554652",
//     "Academic Inspectorate Office",
//     "Head",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Bá Trương Đài",
//     "nbtdai@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0909711233",
//     "Equipment and Maintenance Office",
//     "Head",
//     "NhanVo"
//   );
//   db.register(
//     "Phan Nguyễn Quí Tâm",
//     "tampnq@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0909690124",
//     "Equipment and Maintenance Office",
//     "Deputy Head",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Nam Thắng",
//     "namthang@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0913168121",
//     "General NhanVoistration and  Personnel Office",
//     "Head",
//     "NhanVo"
//   );
//   db.register(
//     "Đường Minh Hiếu",
//     "duonghieu@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0906606066",
//     "General NhanVoistration and  Personnel Office",
//     "Deputy Head",
//     "NhanVo"
//   );
//   db.register(
//     "Lê Phan Nhật Hằng",
//     "hanglpn@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0903392630",
//     "General NhanVoistration and  Personnel Office",
//     "Deputy Head",
//     "NhanVo"
//   );
//   db.register(
//     "Đặng Hữu Khanh",
//     "huukhanhch@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0983621725",
//     "Admissions and Student Affairs Office",
//     "Deputy Head",
//     "NhanVo"
//   );
//   db.register(
//     "Trần Thanh Thưởng",
//     "thuongtt@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0902043979",
//     "Admissions and Student Affairs Office",
//     "Head",
//     "NhanVo"
//   );
//   db.register(
//     "Trần Thị Thu Huyền",
//     "huyenttt@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "985305444",
//     "Admissions and Student Affairs Office",
//     "Deputy Head",
//     "NhanVo"
//   );
//   db.register(
//     "Bùi Thị Lan",
//     "lanbt@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "984608808",
//     "Library",
//     "Deputy Director",
//     "NhanVo"
//   );
//   db.register(
//     "Vũ Trọng Luật",
//     "luatvt@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0909836920",
//     "Library",
//     "Director",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Văn Thủy",
//     "thuynv@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0918883925",
//     "Health Care Office",
//     "Acting Head",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Minh Đạo",
//     "daonm@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0903982082",
//     "Software Technology Center",
//     "Director",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Văn Long",
//     "longnv@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0977179777",
//     "Software Technology Center",
//     "Deputy Director",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Minh Triết",
//     "trietnm@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0889700239",
//     "Digital Learning Center",
//     "Director",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Thị Lại Giang",
//     "giangntl@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0989881167",
//     "Student Services Center",
//     "Deputy Director",
//     "NhanVo"
//   );
//   db.register(
//     "Lê Xuân Thân",
//     "thanlx@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0987620732",
//     "Student Services Center",
//     "Deputy Director",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Phương Thúy",
//     "phuongthuy@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0988881540",
//     "Student Services Center",
//     "Director",
//     "NhanVo"
//   );
//   db.register(
//     "Trần Phong Vinh",
//     "vinhtp@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0913698288",
//     "Physical Education and National Defense Center",
//     "Deputy Director",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Đức Thành",
//     "thanhnd@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0938718371",
//     "Physical Education and National Defense Center",
//     "Director",
//     "NhanVo"
//   );
//   db.register(
//     "Mai Tuấn Khôi",
//     "khoimt@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0909288155",
//     "Innovation and Entrepreneurship Center",
//     "Deputy Director",
//     "NhanVo"
//   );
//   db.register(
//     "Phạm Bạch Dương",
//     "bachduong@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0913755155",
//     "Innovation and Entrepreneurship Center",
//     "Director",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Hà",
//     "haspkt@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0913889739",
//     "Information and Network Center",
//     "Deputy Director",
//     "NhanVo"
//   );
//   db.register(
//     "Huỳnh Nguyên Chính",
//     "chinhhn@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0983929445",
//     "Information and Network Center",
//     "Director",
//     "NhanVo"
//   );
//   db.register(
//     "Dương Thị Kim Oanh",
//     "oanhdtk@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0982967064",
//     "Institute of Technical Education",
//     "Deputy Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Bùi Văn Hồng",
//     "hongbv@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0903686912",
//     "Institute of Technical Education",
//     "Dean",
//     "NhanVo"
//   );
//   db.register(
//     "Nguyễn Văn Tuấn",
//     "tuannv@hcmute.edu.vn",
//     "",
//     "user",
//     "false",
//     "0909535943",
//     "Institute of Technical Education",
//     "Deputy Dean",
//     "NhanVo"
//   );
// };

module.exports.dbinittest = async function () {
  await db.register(
    "NhanVo Tester",
    "admin@hcmute.edu.vn",
    "",
    "admin",
    "false",
    "0123456789",
    "Press and Media Office",
    "Employee",
    "NhanVo"
  );

  await db.register(
    "Tester",
    "test@hcmute.edu.vn",
    "",
    "user",
    "false",
    "0123456789",
    "Press and Media Office",
    "Employee",
    "NhanVo"
  );
};

module.exports.dbinit = function () {
  var results = [];

  fs.createReadStream(
    path.join(__dirname, "../mongodb_config/Account List.csv")
  )
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      results.forEach(async (data) => {
        var pass = "";
        if (data.permission == "admin") {
          pass = "pmo@123";
        }
        await db.register(
          data.name,
          data.email,
          pass,
          data.permission,
          data.fee,
          "0" + data.phone,
          data.unitName,
          data.role,
          "NhanVo"
        );
      });
    });
};
