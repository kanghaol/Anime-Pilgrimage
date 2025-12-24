import express from "express";
import { getLocationsByAnimeId, getlocationsByLocationId, getAllLocations} from "../controllers/locationController";


const router = express.Router();

router.get("/LocationsByAnime/:id", getLocationsByAnimeId);
router.get("/LocationById/:id", getlocationsByLocationId);
router.get("/all", getAllLocations); 

export default router;