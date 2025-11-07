import mongoose from "mongoose";

const AnimeSchema = new mongoose.Schema({
    anime_id: { type: String, required: true },
    title: String,
    description: String,
    poster_url: String,
    year: Number,
    studio: String,
    popularity: {type: Number, default: 0},
    favorite_count: { type: Number, default: 0 },
});

AnimeSchema.index({ anime_id: 1 }, { unique: true });
export const Anime = mongoose.model("Anime", AnimeSchema);