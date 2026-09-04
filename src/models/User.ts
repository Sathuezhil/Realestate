import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    favoriteIds: [{ type: String }],
  },
  { timestamps: true },
);

export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
