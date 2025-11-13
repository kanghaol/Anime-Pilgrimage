import { Request, Response } from "express";
import { Location } from "../models/Location";

export const getLocationsByAnimeId = async (req: Request, res: Response) => {
    try {
        const animeId = req.params.anime_id;
        const locations = await Location.find({ anime_id: animeId });
        res.status(200).json(locations);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving locations" });
    }
}