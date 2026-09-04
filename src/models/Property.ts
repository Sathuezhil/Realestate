import mongoose, { Schema } from "mongoose";

const PropertySchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    propertyType: { type: String, enum: ["apartment", "villa", "office"], required: true },
    bedrooms: { type: Number, required: true, default: 0 },
    bathrooms: { type: Number, required: true, default: 0 },
    areaSqft: { type: Number, required: true },
    furnished: { type: Boolean, required: true, default: false },
    location: {
      area: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    images: [{ type: String, required: true }],
    amenities: [{ type: String }],
    status: { type: String, enum: ["available", "sold", "rented"], default: "available" },
    agent: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
  },
  { timestamps: true },
);

export const PropertyModel =
  mongoose.models.Property || mongoose.model("Property", PropertySchema);
