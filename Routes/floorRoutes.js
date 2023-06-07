import Router from "express";
const router = Router();


import Floor from "../Model/Floor.js";

// Create a new Floor
router.post('/api/floors', async (req, res) => {
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
      const floors = await Floor.find();
  
      res.json(floors);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve Floors' });
    }
  });
  
  // Get a specific Floor
  router.get('/api/floors/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const floor = await Floor.findById(id);
  
      if (!floor) {
        return res.status(404).json({ error: 'Floor not found' });
      }
  
      res.json(floor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve Floor' });
    }
  });
  
  // Update a Floor
  router.put('/api/floors/:id', async (req, res) => {
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
  router.delete('/api/floors/:id', async (req, res) => {
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
  
export default router;