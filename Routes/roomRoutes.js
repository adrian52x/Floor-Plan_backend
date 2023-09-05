import Router from "express";
const router = Router();

import Floor from "../Model/Floor.js";
import Room from "../Model/Room.js";
import Instrument from "../Model/Instrument.js";
import PC from "../Model/PC.js";
import NetworkPoint from "../Model/NetworkPoint.js";


// Create a new Room
router.post('/api/rooms', async (req, res) => {
    try {
      const { name, type, roomNr, floor_id, position } = req.body;

	  // Check if the name is already in use
	  const existingRoom = await Room.findOne({ name })
    

	  if (existingRoom) {
      const roomOnThisFloor = await Floor.findById(existingRoom.floor_id)
        .populate('building_id', 'name');

		  return res.status(400).json({ error: `Room - '${name}' already exists in ${roomOnThisFloor.building_id.name}/${roomOnThisFloor.level}` });
	  }
  
      const room = new Room({
        name,
        type,
        roomNr,
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
        updateFields.roomNr === originalRoom.roomNr &&  
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
	
		// Find the room that is being deleted
		const room = await Room.findById(id);
	
		if (!room) {
			return res.status(404).json({ error: 'Room not found' });
		}
	
		// Unassign instruments associated with this room
		await Instrument.updateMany({ room_id: room._id }, { $unset: { room_id: 1 } });
		// Unassign PCs associated with this room
		await PC.updateMany({ room_id: room._id }, { $unset: { room_id: 1 } });
		// Unassign Network Points associated with this room
		await NetworkPoint.updateMany({ room_id: room._id }, { $unset: { room_id: 1 } });
	
		// Delete the room
		await Room.findByIdAndDelete(id);
	
		res.json({ message: 'Room deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete Room' });
    }
});
  
export default router;