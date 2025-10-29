const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  submittedOn: { type: Date, default: Date.now },
  userId: { type: String, required: true },
  formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  responses: { type: mongoose.Schema.Types.Mixed, required: true },
});

module.exports = responseSchema;
