import { create } from "domain";
import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    animeId: { type: String, required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
    uuId: { type: String, required: true },
    email: { type: String, required: true },
    authType: { type: String, default: "local" }, 
    providerId: String,
    name: String,
    passwordHash: {type: String, default: null },
    favorites: { type: [favoriteSchema], default:[] },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now },
    theme: { type: String, default: "light" },
});

userSchema.index({ uuId: 1 }, { unique: true });

export const User = mongoose.model("User", userSchema, "userCollection");
