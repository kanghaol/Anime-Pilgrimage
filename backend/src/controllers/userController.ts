import { Request, Response } from "express";
import { User } from "../models/User";
import { Anime } from "../models/Anime";

/*return list of favorite anime objects*/
export const getUserFavorites = async (req: Request, res: Response) => {
    try {
        const userUuid = (req as any).user.uuId;
        const user = await User.findOne({ uuId: userUuid }).lean();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const favoritesIds = user.favorites.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime()).map(fav => fav.animeId);

        const favoriteAnimes = await Anime.find({ anime_id: { $in: favoritesIds } }).lean();

        const animeMap = new Map(favoriteAnimes.map(anime => [anime.anime_id, anime]));
        const sortedFavoritesAnimes = favoritesIds.map(id => animeMap.get(id)).filter(anime => anime !== undefined);
        res.status(200).json({ favorites: sortedFavoritesAnimes });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving favorites" });
    }
};

/*return list of favorite anime IDs*/
export const getUserFavoritesIds = async (req: Request, res: Response) => {
    try {
        const userUuid = (req as any).user.uuId;
        const user = await User.findOne({ uuId: userUuid }).lean();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const favoritesIds = user.favorites.map(f => f.animeId);
        res.status(200).json({ favorites: favoritesIds });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving favorite IDs" });
    }
};

export const addFavoriteAnime = async (req: Request, res: Response) => {
    try {
        const userUuid = (req as any).user.uuId;
        const animeId = req.body.favorites;

        if (!animeId) {
            return res.status(400).json({ message: "Anime ID is required" });
        }

        const user = await User.findOne({ uuId: userUuid });
        const anime = await Anime.findOne({ anime_id: animeId });

        if (!user || !anime) {
            return res.status(404).json({ message: "User not found or anime not found" });
        }

        const alreadyFavorited = user.favorites.some(fav => fav.animeId === animeId);

        if (!alreadyFavorited) {
            user.favorites.push({ animeId, addedAt: new Date() });
            anime.favoriteCount += 1;
            await Promise.all([user.save(), anime.save()]);
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

        if (!animeId) {
            return res.status(400).json({ message: "Anime ID is required" });
        }

        const user = await User.findOne({ uuId: userUuid });
        const anime = await Anime.findOne({ anime_id: animeId });

        if (!user || !anime) {
            return res.status(404).json({ message: "User not found or anime not found" });
        }

        const before = user.favorites.length;

        // Remove favorite by animeId
        user.set(
            "favorites",
            user.favorites.filter(fav => fav.animeId !== animeId)
        );

        await user.save();


        if (user.favorites.length !== before) {
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

        const user = await User.findOne({ uuId: userUuid }).lean();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            email: user.email,
            name: user.name,
            favorites: user.favorites.length,
        });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving user profile" });
    }
};

export const migrateGuestUser = async (req: Request, res: Response) => {
    try {
        const userUuid = (req as any).user.uuId;
        const favorites: string[] = req.body.favorites;

        if (!Array.isArray(favorites)) {
            return res.status(400).json({ message: "Invalid favorites data" });
        }

        const user = await User.findOne({ uuId: userUuid });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        //error prevention for duplicate favorites from guest to registered user
        const oldFavoritesSet = new Set(user.favorites.map(fav => fav.animeId));

        const newFavorites = favorites.filter(animeId => !oldFavoritesSet.has(animeId)).map(animeId => ({ animeId, addedAt: new Date() }));
        user.favorites.push(...newFavorites);
        await user.save();
        await Anime.updateMany(
            { anime_id: { $in: newFavorites.map(fav => fav.animeId) } },
            { $inc: { favoriteCount: 1 } }
        );
        res.status(200).json({ message: "Guest user migrated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error migrating guest user" });
    }
};
