import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
    anime_id: { type: String, required: true },
    location_id: { type: String, required: true },
    name: String,
    address: String,
    place: String,
    coordinates: [Number], // [longitude, latitude]
    description: String,
    photo_url: String,
    scene_ref: [String],
    travel_tips: { type: String, default: null },
});

LocationSchema.index({ location_id: 1 }, { unique: true });

export const Location = mongoose.model("Location", LocationSchema, "locationCollection");