import { Request, Response } from "express";
import { Location } from "../models/Location";

export const getLocationsByAnimeId = async (req: Request, res: Response) => {
    try {
        const animeId = req.params.id;
        const locations = await Location.find({ anime_id: animeId });
        res.json({locations});
    } catch (err) {
        res.status(500).json({ message: "Error retrieving locations" });
    }
}

export const getlocationsByLocationId = async (req: Request, res: Response) => {
    {
        try {
            const locationId = req.params.id;
            if (!locationId) {
                return res.status(400).json({ message: "Location ID is required" });
            }
            const location = await Location.findOne({ location_id: locationId });
            res.json({location});
        } catch (err) {
            res.status(500).json({ message: "Error retrieving location" });
        }
    }
}

export const getAllLocations = async (req: Request, res: Response) => {
    try {
        const locations = await Location.find({});
        res.json({ locations });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving locations" });
    }   
}