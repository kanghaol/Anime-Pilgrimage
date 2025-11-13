import { Request, Response } from "express";
import { Anime } from "../models/Anime";
import mongoose from "mongoose";

export const getAnimeList = async (req: Request, res: Response) => {
    try {
        const limit = 10;
        const cursorPopularity = req.query.popularity
            ? Number(req.query.popularity)
            : undefined;
        const cursorId = req.query.id as string | undefined;

        const query: any = {};

        if (cursorPopularity != null && cursorId && mongoose.Types.ObjectId.isValid(cursorId)) {
            query.popularity = { $lt: cursorPopularity };
            query._id = { $gt: cursorId };
        }

        const animeList = await Anime.find(query)
            .sort({ popularity: -1, _id: 1 })
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
