const mongoose = require("mongoose");
const userSchema = require("../schemas/user");
const User = mongoose.model("User", userSchema);

module.exports = {
  create: async ({ username, password }) => {
    if (await User.findOne({ username })) {
      return { error: "User already exists" };
    }
    const user = new User({
      username,
      password,
      createdOn: new Date(),
      updatedOn: new Date(),
    });
    await user.save();
    return user;
  },
  login: async ({ username, password }) => {
    const user = await User.findOne({ username, password });
    if (user) {
      return { success: true, user };
    }
    return { success: false, error: "Invalid credentials" };
  },
};
