import Router from "express";
const router = Router();

import Room from "../Model/Room.js";
import Instrument from "../Model/Instrument.js";
import PC from "../Model/PC.js";
import NetworkPoint from "../Model/NetworkPoint.js";


//Get all assigned Items (Instruments/PCs/Ports)
router.get('/api/assigned-items', async (req, res) => {
  try {
      const instruments = await Instrument.find({
        room_id: { $exists: true }
      })
      .select("-__v")
      .populate('room_id', 'name floor_id');

      const pcs = await PC.find({
        room_id: { $exists: true }
      })
      .select("-__v")
      .populate('room_id', 'name floor_id');

      const ports = await NetworkPoint.find({
        room_id: { $exists: true }
      })
      .select("-__v")
      .populate('room_id', 'name floor_id');

      const assignedItems = [
        ...instruments.map(instrument => ({
            _id: instrument._id,
            type: "Instrument",
            name: instrument.name,
            room_id: instrument.room_id._id,
            roomName: instrument.room_id.name,
            floor_id: instrument.room_id.floor_id
        })),
        ...pcs.map(pc => ({
            _id: pc._id,
            type: "PC",
            name: pc.name,
            room_id: pc.room_id._id,
            roomName: pc.room_id.name,
            floor_id: pc.room_id.floor_id
        })),
        ...ports.map(port => ({
            _id: port._id,
            type: "Network point",
            name: port.name,
            room_id: port.room_id._id,
            roomName: port.room_id.name,
            floor_id: port.room_id.floor_id
        }))
    ];

    res.json(assignedItems);


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve Instruments' });
  }
});

// Get all Instruments/PCs/Ports associeted with a specific Room
router.get('/api/1room-items', async (req, res) => {
  try {
    const { roomName } = req.query;

    const room = await Room.findOne({ name: roomName });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const pcs = await PC.find({ room_id: room._id})
      .select('-room_id -__v')

    const ports = await NetworkPoint.find({ room_id: room._id })
      .select('-room_id -__v')  

    const instruments = await Instrument.find({ room_id: room._id })
      .select('-__v -room_id')
              
      const roomItems = {
          roomId: room._id,
          roomName: room.name,
          roomType: room.type,
          instruments: instruments,
          PCs: pcs,
          netWorkPorts: ports
      }

    res.json(roomItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve RoomInstrument entries' });
  }
});

// Assign Item to Room
router.patch('/api/itemToRoom', async (req, res) => {
	try {
		const { roomId, itemId, itemType } = req.body;

		// Check if the provided item type is valid
		const validItemTypes = ['Instrument', 'PC', 'Network Point'];
		if (!validItemTypes.includes(itemType)) {
			return res.status(400).json({ error: 'Invalid item type' });
		}

		// Check if the item exists based on its type
		let itemModel;
		switch (itemType) {
		  case 'Instrument':
			itemModel = Instrument;
			break;
		  case 'PC':
			itemModel = PC;
			break;
		  case 'Network Point':
			itemModel = NetworkPoint;
			break;
		  default:
			return res.status(400).json({ error: 'Invalid item type' });
		}
	
		// Check if item exists
		const item = await itemModel.findById(itemId);
		if (!item) {
		  return res.status(404).json({ error: `${itemType} not found` });
		}

		// Check if room exists
		const room = await Room.exists({ _id: roomId });
		if (!room) {
			return res.status(404).json({ error: 'Room not found' });
		}

		// Check if an instrument with the same ID already exists in the room
		const itemAlreadyExists = await itemModel.exists({ _id:itemId, room_id: roomId });

		if (itemAlreadyExists) {
			return res.status(400).json({ error: `This ${itemType} already exists in this room` });
		}


		// check if item is not assigned to any room
		if (item.room_id === undefined) {
			item.room_id = roomId;
			await item.save();
			res.json(item);
		} else {
			return res.status(400).json({ error: `This ${itemType} already exists in a different room` });
		}

	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to assign Item to Room' });
	}
});

 // UnAssign Item from Room
 router.patch('/api/removeItemfromRoom', async (req, res) => {
	try {
		const { roomId, itemId, itemType } = req.body;

		// Check if the provided item type is valid
		const validItemTypes = ['Instrument', 'PC', 'Network Point'];
		if (!validItemTypes.includes(itemType)) {
			return res.status(400).json({ error: 'Invalid item type' });
		}

		// Check if the item exists based on its type
		let itemModel;
		switch (itemType) {
		  case 'Instrument':
			itemModel = Instrument;
			break;
		  case 'PC':
			itemModel = PC;
			break;
		  case 'Network Point':
			itemModel = NetworkPoint;
			break;
		  default:
			return res.status(400).json({ error: 'Invalid item type' });
		}

		// Check if item exists
		const item = await itemModel.findOne({ room_id: roomId, _id: itemId });
		if (!item) {
		  return res.status(404).json({ error: `${itemType} not found` });
		}
  
	  
		item.room_id = undefined;
		await item.save();
		res.json(item);
  
  
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: 'Failed to unassign Item from Room' });
	}
  });

// // Assign Instrument to Room
// router.patch('/api/instrumentToRoom', async (req, res) => {
//     try {
//       const { roomId, instrumentId, itemType } = req.body;

//     // Check if room and instrument exist
//     const roomExists = await Room.exists({ _id: roomId });
//     const instrumentExists = await Instrument.exists({ _id: instrumentId });

//     if (!roomExists || !instrumentExists) {
//       return res.status(404).json({ error: 'Room or instrument not found' });
//     }

//     // Check if an instrument with the same ID already exists in the room
//     const instrumentAlreadyExists = await Instrument.exists({ _id:instrumentId, room_id: roomId });

//     if (instrumentAlreadyExists) {
//       return res.status(400).json({ error: 'This instrument already exists in this room' });
//     }

//     const instrumentAlreadyInUse = await Instrument.findById(instrumentId);

//     if (!instrumentAlreadyInUse) {
//         return res.status(404).json({ error: 'Instrument not found' });
//     }
//     console.log(instrumentAlreadyInUse.room_id);

//     if (instrumentAlreadyInUse.room_id === undefined) {
//         // check if instrument is not assigned to any room
//         instrumentAlreadyInUse.room_id = roomId;
//         await instrumentAlreadyInUse.save();
//         res.json(instrumentAlreadyInUse);
//     } else {
//         return res.status(400).json({ error: 'This instrument already exists in a different room' });
//     }
  
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Failed to assign Instrument to Room' });
//     }
//   });


//   // UnAssign Instrument from Room
// router.patch('/api/removeInstrumentfromRoom', async (req, res) => {
//   try {
//     const { roomId, instrumentId } = req.body;

//     const roomInstrument = await Instrument.findOne({ room_id: roomId, _id: instrumentId });
  
//       //console.log(roomInstrument);
//       if (!roomInstrument) {
//         return res.status(404).json({ error: 'Room-Instrument entry not found' });
//       }

//       roomInstrument.room_id = undefined;
//       await roomInstrument.save();
//       res.json(roomInstrument);


//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to unassign Instrument from Room' });
//   }
// });


// Assign PC to Room
// UnAssign PC from Room

// Assign Network Point to Room
// UnAssign Network Point from Room





export default router;