import Router from "express";
const router = Router();


import Room from "../Model/Room.js";
import RoomInstrument from "../Model/RoomInstrument.js";

// Create a new Room
router.post('/api/rooms', async (req, res) => {
    try {
      const { name, type, floor_id, position } = req.body;

      const roomType = type || 'room';

	  // Check if the name and floor_id combination is already in use
	  const existingRoom = await Room.findOne({ name, floor_id });

	  if (existingRoom) {
		return res.status(400).json({ error: `Room - '${name}' already exists on this floor` });
	  }
  
      const room = new Room({
        name,
        type: roomType,
        floor_id,
        position
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
      const rooms = await Room.find()
        .select('-__v')
        .exec();
  
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
router.patch('/api/rooms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = { ...req.body }; // Copy all properties from req.body


	  const originalRoom = await Room.findById(id);

    const isSame = ( 
        updateFields.name === originalRoom.name && 
        updateFields.type === originalRoom.type && 
        JSON.stringify(updateFields.position) === JSON.stringify(originalRoom.position)
    )
    if (isSame) {
      return res.sendStatus(204); // No changes were made to the room
    }

    const room = await Room.findByIdAndUpdate(
      id,
      updateFields,
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

	  // Delete the RoomInstruments entries associated with the Room
	  await RoomInstrument.deleteMany({ roomId: id });
  
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