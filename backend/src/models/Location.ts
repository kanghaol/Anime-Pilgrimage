import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
    anime_id: { type: String, required: true },
    location_id: { type: String, required: true },
    name: String,
    address: String,
    place: String,
    coordinates: [Number],
    description: String,
    photo_url: String,
    scene_ref: String,
    nearest_station: { type: String, default: null },
    access_info: { type: String, default: null },
    travel_tips: { type: String, default: null },
});

LocationSchema.index({ location_id: 1 }, { unique: true });

export const Location = mongoose.model("Location", LocationSchema);