import mongoose from "mongoose";

const AnimeSchema = new mongoose.Schema({
    anime_id: { type: String, required: true },
    title: String,
    description: String,
    photo_url: String,
    year: Number,
    studio: String,
    popularity: {type: Number, default: 0},
    locations: { type: Number, default: 0 },
    favoriteCount: { type: Number, default: 0 },
});

AnimeSchema.index({ anime_id: 1 }, { unique: true });
AnimeSchema.index({ popularity: -1, _id: 1 });
export const Anime = mongoose.model("Anime", AnimeSchema, "animeCollection");