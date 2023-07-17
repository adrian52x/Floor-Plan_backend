import Router from "express";
const router = Router();

import RoomInstrument from "../Model/RoomInstrument.js";
import Room from "../Model/Room.js";
import Instrument from "../Model/Instrument.js";


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
  
  // Get all Room-Instrument entries
  router.get('/api/room-instruments', async (req, res) => {
    try {
      const roomInstruments = await RoomInstrument.find()
        .populate('roomId', 'name type')
        .populate('instrumentId', 'name description');


    // // Map the results to create a new array with the modified objects
    // const modifiedRoomInstruments = roomInstruments.map(item => ({
    //     _id: item._id,
	// 	//roomId: item.roomId._id,
    //     roomName: item.roomId.name,
    //     roomType: item.roomId.type,

    //     instrumentName: item.instrumentId.name,
    //     instrumentDesc: item.instrumentId.description
    // }));

		const modifiedRoomInstruments = roomInstruments.map(async (item) => {
			const room = await Room.findById(item.roomId._id);
			return {
			_id: item._id,
			roomId: item.roomId._id,
			roomName: item.roomId.name,
			roomType: item.roomId.type,
			name: item.instrumentId.name,
			instrumentDesc: item.instrumentId.description,
			floorId: room.floor_id, // Include the floorId from the room document
			};
		});

		const results = await Promise.all(modifiedRoomInstruments);


      
  
      	res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve RoomInstrument entries' });
    }
  });

  // Get all Instruments associeted with a specific Room
  router.get('/api/1room-instruments', async (req, res) => {
    try {
      const { roomName } = req.query;
  
      const room = await Room.findOne({ name: roomName });
  
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
  
      const roomInstruments = await RoomInstrument.find({ roomId: room._id })
        .populate('roomId', 'name type')
        .populate('instrumentId', 'name description');        


      	// Extract instrument names into an array
	  	const instruments = roomInstruments.map(item => ({
			name: item.instrumentId.name,
			description: item.instrumentId.description
	  	})); 


        const modifiedRoomInstruments = {
            roomName: room.name,
            roomType: room.type,
            instruments: instruments
        }

        console.log(modifiedRoomInstruments);
  
      res.json(modifiedRoomInstruments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve RoomInstrument entries' });
    }
  });

  // Get all Rooms associeted with a specific Instruments
  router.get('/api/1instrument-rooms', async (req, res) => {
    try {
      const { instrumentName } = req.query;
  
      const instrument = await Instrument.findOne({ name: instrumentName });
  
      if (!instrument) {
        return res.status(404).json({ error: 'Instrument not found' });
      }
  
      const roomInstruments = await RoomInstrument.find({ instrumentId: instrument._id })
        .populate('roomId', 'name type')
        .populate('instrumentId', 'name description');        
  
		const modifiedRoomInstruments = roomInstruments.map(async (item) => {
			const room = await Room.findById(item.roomId._id);
			return {
			_id: item._id,
			roomId: item.roomId._id,
			roomName: item.roomId.name,
			roomType: item.roomId.type,
			instrumentName: item.instrumentId.name,
			instrumentDesc: item.instrumentId.description,
			floorId: room.floor_id, // Include the floorId from the room document
			};
		});
	
		const results = await Promise.all(modifiedRoomInstruments);
	
		res.json(results);
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