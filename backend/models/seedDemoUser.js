const { User } = require("./collections");

async function seedDemoUser() {
  const existing = await User.findOne({ username: "demo@formrenderer.com" });
  if (!existing) {
    await User.create({
      username: "demo@formrenderer.com",
      password: "demo123",
    });
    console.log("Demo user created");
  } else {
    console.log("Demo user already exists");
  }
}

module.exports = seedDemoUser;
