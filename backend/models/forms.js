let forms = [];

const mongoose = require("mongoose");
const formSchema = require("../schemas/form");
const Form = mongoose.model("Form", formSchema);

module.exports = {
  getAll: async () => {
    // Get all forms
    const forms = await Form.find();
    // Get response counts for each form
    const mongoose = require("mongoose");
    const responseSchema = require("../schemas/response");
    const Response =
      mongoose.models.Response || mongoose.model("Response", responseSchema);
    const counts = await Response.aggregate([
      { $group: { _id: "$formId", count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(
      counts.map((c) => [String(c._id), c.count])
    );
    // Attach responseCount to each form
    return forms.map((f) => ({
      ...f.toObject(),
      responseCount: countMap[String(f._id)] || 0,
    }));
  },
  get: async (formId) => await Form.findById(formId),
  create: async (data) => {
    const form = new Form({
      name: data.name,
      status: data.status,
      url: data.url,
      schema: data.schema,
      createdOn: new Date(),
      updatedOn: new Date(),
    });
    await form.save();
    return form;
  },
  update: async (formId, data) => {
    const form = await Form.findByIdAndUpdate(
      formId,
      { ...data, updatedOn: new Date() },
      { new: true }
    );
    return form;
  },
  remove: async (formId) => {
    await Form.findByIdAndDelete(formId);
    return { success: true };
  },
};
