var crypto = require("crypto");
var redis = require("./redis");

/**
 * generates random string of characters i.e salt
 * NOTE - function
 * param {number} length - Length of the random string.
 */
module.exports.genRandomString = function (length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") /** convert to hexadecimal format */
    .slice(0, length); /** return required number of characters */
};

/**
 * hash password with sha512.
 * NOTE - function
 * param {string} password - List of required fields.
 * param {string} salt - Data to be validated.
 */
module.exports.sha512 = function (password, salt) {
  var hash = crypto.createHmac("sha512", salt); /** Hashing algorithm sha512 */
  hash.update(password);
  var value = hash.digest("hex");
  return {
    salt: salt,
    passwordHash: value,
  };
};

module.exports.saltHashPassword = function (userpassword) {
  var salt = this.genRandomString(12); /** Gives us salt of length 12 */
  return this.sha512(userpassword, salt);
};

module.exports.isPasswordCorrect = function (userpassword, passwordHash, salt) {
  if (passwordHash == this.sha512(userpassword, salt).passwordHash) {
    return true;
  } else {
    return false;
  }
};
