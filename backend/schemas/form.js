const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, required: true },
  url: { type: String, required: false },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now },
  schema: { type: mongoose.Schema.Types.Mixed, required: false },
});

module.exports = formSchema;
