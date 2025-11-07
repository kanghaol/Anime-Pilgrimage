import { Request, Response } from "express";
import { Anime } from "../models/Anime";
import mongoose from "mongoose";

export const getAnimeList = async (req: Request, res: Response) => {
    try {
        const limit = 20;
        const cursorPopularity = parseFloat(req.query.popularity as string);
        const cursorId = req.query.id as string | undefined;

        const query: any = {};
        if (cursorPopularity && cursorId && mongoose.Types.ObjectId.isValid(cursorId)) {
            query.$or = [
                { popularity: { $lt: cursorPopularity } },
                { popularity: cursorPopularity, _id: { $gt: new mongoose.Types.ObjectId(cursorId) } },
            ];
        }

        const animeList = await Anime.find(query)
            .sort({ popularity: -1, _id: 1 })
            .limit(limit);
             
        let nextCursor: string | null = null;
        if (animeList.length === limit) {
            const lastitem = animeList.at(-1);
            if (lastitem !== undefined && lastitem._id) {
                nextCursor = lastitem._id.toString();
            }
        } else {
            nextCursor = null;
        }
        
        res.json({ animeList, nextCursor, hasMore: !!nextCursor });

    } catch (err) {
        res.status(500).json({ message: "Error fetching anime list" });
    }
}