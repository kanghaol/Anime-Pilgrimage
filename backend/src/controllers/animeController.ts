import { Request, Response } from "express";
import { Anime } from "../models/Anime";
import mongoose from "mongoose";
import { STATUS_CODES } from "http";

export const getAnimeList = async (req: Request, res: Response) => {
    try {
        const limit = 10;
        const cursorPopularity = req.query.popularity
            ? Number(req.query.popularity)
            : undefined;
        const _id = req.query.id as string | undefined;

        const query: any = {};

        if (cursorPopularity != null && _id && mongoose.Types.ObjectId.isValid(_id)) {
            
            query.$or = [
                { popularity: { $lt: cursorPopularity } },
                { 
                    popularity: cursorPopularity,
                    _id: { $lt: new mongoose.Types.ObjectId(_id) }
                }
            ];
        }

        const animeList = await Anime.find(query)
            .sort({ popularity: -1, _id: -1 })
            .limit(limit);

        const lastItem = animeList.at(-1);

        res.json({
            animeList,
            nextCursor: lastItem ? lastItem._id.toString() : null,
            nextPopularity: lastItem ? lastItem.popularity : null,
            hasMore: animeList.length === limit,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching anime list" });
    }
};

export const getAnime = async (req: Request, res: Response) => {
    try {
        const animeId = req.params.id;
        if (!animeId) {
            return res.status(400).json({ message: "Invalid anime ID" });
        }
        const anime = await Anime.findOne({anime_id: animeId});
        if (!anime) {
            return res.status(404).json({ message: "Anime not found" });
        }
        res.json({anime});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching anime details" });
    }
};

export const searchAnime = async (req: Request, res: Response) => {
    try {
        const q = req.query.q as string;
        if (!q || q.trim().length === 0) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const query = q.trim();
        const animeList = await Anime.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { studio: { $regex: query, $options: "i" } }
            ]
        }).lean();

        res.json(animeList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error searching anime" });
    }
};