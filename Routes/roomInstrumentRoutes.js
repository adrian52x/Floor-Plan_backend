import Router from "express";
const router = Router();

import RoomInstrument from "../Model/RoomInstrument.js";


// Create a new RoomInstrument entry
router.post('/api/room-instruments', async (req, res) => {
    try {
      const { roomId, instrumentId } = req.body;
  
      const roomInstrument = new RoomInstrument({
        roomId,
        instrumentId
      });
  
      const savedRoomInstrument = await roomInstrument.save();
  
      res.json(savedRoomInstrument);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create RoomInstrument entry' });
    }
  });
  
  // Get all RoomInstrument entries
  router.get('/api/room-instruments', async (req, res) => {
    try {
      const roomInstruments = await RoomInstrument.find();
  
      res.json(roomInstruments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve RoomInstrument entries' });
    }
  });
  
  // Delete a RoomInstrument entry
  router.delete('/api/room-instruments/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      await RoomInstrument.findByIdAndDelete(id);
  
      res.json({ message: 'RoomInstrument entry deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete RoomInstrument entry' });
    }
});
  
export default router;