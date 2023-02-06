import Router from "express";
const router = Router();

import Object from "../Model/buildingObject.js";
//import { verifyPlateNumber, adminOnly } from "../middleware.js";




//Get all objects
router.get("/api/objects", async (req, res) => {
  try {
    const objects = await Object.find();
    if (!objects) {
      throw new Error("No objects");
    }
    res
      .status(200)
      .json({ Objects: objects });
  } catch (error) {
    res.status(400).json({ message: "something wrong" });
  }
});



// Find an Object by name
router.get("/api/object/:key", async (req, res) => {
  const { key } = req.params;
  const regex = new RegExp(key, "i");
  try {
    const objects = await Object.find({ name: { $regex: regex } });
    if (!objects) {
      throw new Error("No objects");
    }
    res
      .status(200)
      .json({ Objects: objects });
  } catch (error) {
    res.status(400).json({ message: "something wrong" });
  }
});



// Admin // Create an Object
router.post("/api/object", async (req, res) => {
  try {
    const { name, objectType, floor, equipment } = req.body;

    // Create building in database
    const object = await Object.create({
      name: name,
      objectType: objectType,
      floor: floor,
      equipment: equipment
    });

    return res.status(201).json(object);
  } catch (err) {
    console.log(err);
  }
});







export default router;