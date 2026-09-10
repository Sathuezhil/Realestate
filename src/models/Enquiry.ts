import mongoose, { Schema } from "mongoose";

const EnquirySchema = new Schema(
  {
    propertyId: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    source: { type: String, enum: ["property", "contact", "intake"], default: "property" },
    status: { type: String, enum: ["new", "contacted", "closed"], default: "new" },
    viewingAt: { type: String },
    viewingType: { type: String, enum: ["in-person", "video"] },
    community: { type: String },
    budget: { type: String },
    bedrooms: { type: String },
    timeline: { type: String },
  },
  { timestamps: true },
);

if (mongoose.models.Enquiry) {
  mongoose.deleteModel("Enquiry");
}

export const EnquiryModel = mongoose.model("Enquiry", EnquirySchema);
