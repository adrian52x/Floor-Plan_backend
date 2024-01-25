import Router from "express";
const router = Router();


import Floor from "../Model/Floor.js";
import Building from "../Model/Building.js";
import Department from "../Model/Department.js";
import Room from "../Model/Room.js";

import { adminOnly, viewer } from "../middleware.js";
import { sortItems } from "../utils.js";

// Create a new Floor
router.post('/api/floors', adminOnly, async (req, res) => {
    try {
      const { level, building_id } = req.body;
  
      const floor = new Floor({
        level,
        building_id
      });
  
      const savedFloor = await floor.save();
  
      res.json(savedFloor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create Floor' });
    }
  });
  
  // Get all Floors
  router.get('/api/floors', async (req, res) => {
    try {
      const floors = await Floor.find()
        .populate('building_id', 'name');


    // Map the results to create a new array with the modified objects
    const modifiedFloors = floors.map(item => ({
        _id: item._id,
        level: item.level,
        building: item.building_id.name,
    }));

      
  
      res.json(modifiedFloors);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve Floors' });
    }
  });
  
  // Get a specific Floor
  router.get('/api/floors/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const floor = await Floor.findById(id)
        .populate('building_id', 'name');
  
      if (!floor) {
        return res.status(404).json({ error: 'Floor not found' });
      }

      // Map the results to create a new array with the modified objects
      const modifiedFloor = {
        _id: floor._id,
        level: floor.level,
        building: floor.building_id.name,
      };
  
      res.json(modifiedFloor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve Floor' });
    }
  });
  
  // Update a Floor
  router.put('/api/floors/:id', adminOnly, async (req, res) => {
    try {
      const { id } = req.params;
      const { level, building_id } = req.body;
  
      const floor = await Floor.findByIdAndUpdate(
        id,
        { level, building_id },
        { new: true }
      );
  
      if (!floor) {
        return res.status(404).json({ error: 'Floor not found' });
      }
  
      res.json(floor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update Floor' });
    }
  });
  
  // Delete a Floor
  router.delete('/api/floors/:id', adminOnly, async (req, res) => {
    try {
      const { id } = req.params;
  
      const floor = await Floor.findByIdAndDelete(id);
  
      if (!floor) {
        return res.status(404).json({ error: 'Floor not found' });
      }
  
      res.json({ message: 'Floor deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete Floor' });
    }
});


// API endpoint to find a specific floor by building name and level
// GET /api/floor?buildingName=VAT83A&level=4
router.get('/api/floor', async (req, res) => {
  try {
    const { buildingName, level } = req.query;

    // Find the building ID based on the building name
    const building = await Building.findOne({ name: buildingName });

    if (!building) {
      return res.status(404).json({ error: 'Building not found' });
    }

    // Find the floor based on the building ID and level
    const floor = await Floor.findOne({ building_id: building._id, level })
        .select('-building_id -__v')
        .exec();

    if (!floor) {
      return res.status(404).json({ error: 'Floor not found' });
    }


    let departments = await Department.find({ floor_id: floor.id })
        .select('-floor_id -__v')
        .exec();
    departments = sortItems(departments);


    let rooms = await Room.find({ floor_id: floor.id })
        .select('-floor_id -__v')
        .exec();   
    rooms = sortItems(rooms);     

    const formattedFloor = {
        _id: floor._id,
        level: floor.level,
        departments: departments,
        rooms: rooms
    };


    res.json(formattedFloor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve floor' });
  }
});
  
export default router;