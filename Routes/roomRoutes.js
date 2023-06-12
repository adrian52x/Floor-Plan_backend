import Router from "express";
const router = Router();


import Room from "../Model/Room.js";

// Create a new Room
router.post('/api/rooms', async (req, res) => {
    try {
      const { name, type, floor_id } = req.body;

      const roomType = type || 'room';
  
      const room = new Room({
        name,
        type: roomType,
        floor_id
      });
  
      const savedRoom = await room.save();
  
      res.json(savedRoom);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create Room' });
    }
  });
  
  // Get all Rooms
  router.get('/api/rooms', async (req, res) => {
    try {
      const rooms = await Room.find();
  
      res.json(rooms);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve Rooms' });
    }
  });
  
  // Get a specific Room
  router.get('/api/rooms/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const room = await Room.findById(id);
  
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
  
      res.json(room);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve Room' });
    }
  });
  
  // Update a Room
  router.put('/api/rooms/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, type, floor_id } = req.body;
  
      const room = await Room.findByIdAndUpdate(
        id,
        { name, type, floor_id },
        { new: true }
      );
  
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
  
      res.json(room);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update Room' });
    }
  });
  
  // Delete a Room
  router.delete('/api/rooms/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const room = await Room.findByIdAndDelete(id);
  
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
  
      res.json({ message: 'Room deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete Room' });
    }
});
  
export default router;