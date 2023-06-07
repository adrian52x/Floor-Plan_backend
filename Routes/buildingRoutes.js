import Router from "express";
const router = Router();

import Building from "../Model/Building.js";
import Floor from "../Model/Floor.js";
import Department from "../Model/Department.js";
import Room from "../Model/Room.js";
import RoomInstrument from "../Model/RoomInstrument.js";


//import { verifyPlateNumber, adminOnly } from "../middleware.js";


// Get a specific building with its floors, rooms, and departments
router.get('/buildings/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const building = await Building.findById(id);

    if (!building) {
      return res.status(404).json({ error: 'Building not found' });
    }

    const floors = await Floor.find({ building_id: id })
 

    res.json({ building, floors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve Building, Floors, Rooms, and Departments' });
  }
});


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



// Create a Building
router.post("/api/building", async (req, res) => {
  try {
    const { name, location } = req.body;

    // Create building in database
    const building = await Building.create({
      name: name,
      location: location
    });

    return res.status(201).json(building);
  } catch (err) {
    res.json({ message: err })
  }
});


// Get a specific building with its floors
router.get('/api/buildings/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const building = await Building.findById(id);

    if (!building) {
      return res.status(404).json({ error: 'Building not found' });
    }

    const floors = await Floor.find({ building_id: id });

    res.json({ building, floors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve Building and Floors' });
  }
});







export default router;