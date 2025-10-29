const mongoose = require("mongoose");
const formSchema = require("../schemas/form");
const responseSchema = require("../schemas/response");
const userSchema = require("../schemas/user");

const Form = mongoose.model("Form", formSchema);
const Response = mongoose.model("Response", responseSchema);
const User = mongoose.model("User", userSchema);

module.exports = {
  Form,
  Response,
  User,
};
