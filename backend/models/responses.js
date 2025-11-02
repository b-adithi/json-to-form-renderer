const mongoose = require("mongoose");
const responseSchema = require("../schemas/response");
const Response = mongoose.model("Response", responseSchema);

module.exports = {
  getAll: async () => await Response.find(),
  get: async (responseId) => await Response.findById(responseId),
  getByFormId: async (formId) => await Response.find({ formId }),
  create: async (data) => {
    const response = new Response({
      userId: data.userId,
      userFullName: data.userFullName,
      formId: data.formId,
      responses: data.responses,
      submittedOn: new Date(),
    });
    await response.save();
    return response;
  },
};
