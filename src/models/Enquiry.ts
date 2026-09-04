import mongoose, { Schema } from "mongoose";

const EnquirySchema = new Schema(
  {
    propertyId: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    source: { type: String, enum: ["property", "contact"], default: "property" },
  },
  { timestamps: true },
);

export const EnquiryModel =
  mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema);
