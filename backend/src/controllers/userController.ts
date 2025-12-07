import { Request, Response } from "express";
import { User } from "../models/User";
import { Anime } from "../models/Anime";

export const getUserFavorites = async (req: Request, res: Response) => {
    try {
        const userUuid = (req as any).user.uuId;
        const user = await User.findOne({ uuId: userUuid });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const favoritesIds = user.favorites;
        const favoriteAnimes = await Anime.find({ anime_id: { $in: favoritesIds } });

        res.status(200).json({ favorites: favoriteAnimes});
    } catch (err) {
        res.status(500).json({ message: "Error retrieving favorites" });
    }
};

export const getUserFavoritesIds = async (req: Request, res: Response) => {
    try {
        const userUuid = (req as any).user.uuId;
        const user = await User.findOne({ uuId: userUuid });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const favoritesIds = user.favorites;
        res.status(200).json({ favorites: favoritesIds });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving favorite IDs" });
    }
};

export const addFavoriteAnime = async (req: Request, res: Response) => {
    try {
        const userUuid = (req as any).user.uuId;
        const animeId = req.body.favorites;
        const user = await User.findOne({ uuId: userUuid });
        const anime = await Anime.findOne({ anime_id: animeId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!animeId) {
            return res.status(400).json({ message: "Anime ID is required" });
        }
        if (!user.favorites.includes(animeId) && anime) {
            user.favorites.push(animeId);
            anime.favoriteCount += 1;
            await anime.save();
            await user.save();
        }
        res.status(200).json({ message: "Anime added to favorites" });
    } catch (err) {
        res.status(500).json({ message: "Error adding favorite anime" });
    }
};

export const removeFavoriteAnime = async (req: Request, res: Response) => {
    try {
        const userUuid = (req as any).user.uuId;
        const animeId = req.body.favorites;
        const user = await User.findOne({ uuId: userUuid });
        const anime = await Anime.findOne({ anime_id: animeId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!animeId) {
            return res.status(400).json({ message: "Anime ID is required" });
        }
        const index = user.favorites.indexOf(animeId);
        if (index > -1) {
            user.favorites.splice(index, 1);
            await user.save();
            if (anime && anime.favoriteCount > 0) {
                anime.favoriteCount -= 1;
                await anime.save();
            }
        }
        res.status(200).json({ message: "Anime removed from favorites" });
    } catch (err) {
        res.status(500).json({ message: "Error removing favorite anime" });
    }
}; 

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const userUuid = (req as any).user.uuId;
        const user = await User.findOne({ uuId: userUuid });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ 
            email: user.email,
            name: user.name,
            favorites : user.favorites.length,
            message: "User profile retrieved successfully"
        });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving user profile" });
    }
};

export const migrateGuestUser = async (req: Request, res: Response) => {
    try {
        const userUuid = (req as any).user.uuId;
        const user = await User.findOne({ uuId: userUuid });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const favorites = req.body.favorites;
        if (!Array.isArray(favorites)) {
            return res.status(400).json({ message: "Invalid favorites data" });
        }
        user.favorites = Array.from(new Set([...user.favorites, ...favorites]));
        await user.save();
        res.status(200).json({ message: "Guest favorites migrated successfully" });
        for (const animeId of favorites) {
            const anime = await Anime.findOne({ anime_id: animeId });
            if (anime) {
                anime.favoriteCount += 1;
                await anime.save();
            }
        }
    } catch (err) {
        res.status(500).json({ message: "Error migrating guest user" });
    }
};
