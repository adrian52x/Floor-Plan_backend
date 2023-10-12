import Router from "express";
const router = Router();

import Building from "../Model/Building.js";
import Floor from "../Model/Floor.js";
import Department from "../Model/Department.js";
import Room from "../Model/Room.js";
import RoomInstrument from "../Model/RoomInstrument.js";


import { adminOnly } from "../middleware.js";


// Get a specific building with its floors
router.get('/api/buildings/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const building = await Building.findById(id).select('-__v');

    if (!building) {
      return res.status(404).json({ error: 'Building not found' });
    }

    const floors = await Floor.find({ building_id: id })
    .populate("building_id")
    .select('-building_id -__v')
      
    .exec();

    res.json({ building, floors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve Building and related data' });
  }
});


//Get all Buildings with floors
router.get('/api/buildings', async (req, res) => {
  try {

    const buildings = await Floor.aggregate([
      {
        $lookup: {
          from: 'buildings',
          localField: 'building_id',
          foreignField: '_id',
          as: 'building'
        }
      },
      {
        $project: {
          building: {
            $arrayElemAt: ['$building', 0]
          },
          level: 1
        }
      },
      {
        $project: {
          'building._id': 1,
          'building.name': 1,
          'building.location': 1,
          level: 1
        }
      },
      {
        $group: {
          _id: '$building',
          floors: {
            $push: '$level'
          }
        }
      },
      {
        $project: {
          _id: '$_id._id',
          name: '$_id.name',
          location: '$_id.location',
          floors: 1
        }
      }
    ]);

    res.json({ buildings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve Buildings and Floors' });
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
router.post("/api/building", adminOnly, async (req, res) => {
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







export default router;