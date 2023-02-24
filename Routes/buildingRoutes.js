import Router from "express";
const router = Router();

import Building from "../Model/Building.js";
//import { verifyPlateNumber, adminOnly } from "../middleware.js";




//Get all Buildings
router.get("/api/buildings", async (req, res) => {
  try {
    const buildings = await Building.find();
    if (!buildings) {
      throw new Error("No buildings");
    }
    res
      .status(200)
      .json({ Buildings: buildings });
  } catch (error) {
    res.status(400).json({ message: "something wrong" });
  }
});



// Find a Building by location
router.get("/api/building/:key", async (req, res) => {
  const { key } = req.params;
  const regex = new RegExp(key, "i");
  try {
    const buildings = await Building.find({ location: { $regex: regex } });
    if (!buildings) {
      throw new Error("No buildings");
    }
    res
      .status(200)
      .json({ Buildings: buildings });
  } catch (error) {
    res.status(400).json({ message: "something wrong" });
  }
});



// Admin // Create a Building
router.post("/api/building", async (req, res) => {
  try {
    const { name, lng, lat, location, floors } = req.body;

    // Create building in database
    const building = await Building.create({
      name: name,
      lng: lng,
      lat: lat,
      location: location,
      floors: floors
    });

    return res.status(201).json(building);
  } catch (err) {
    res.json({ message: err })
  }
});







export default router;