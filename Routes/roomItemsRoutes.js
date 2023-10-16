import Router from "express";
const router = Router();

import Room from "../Model/Room.js";
import Instrument from "../Model/Instrument.js";
import PC from "../Model/PC.js";
import NetworkPoint from "../Model/NetworkPoint.js";

import { adminOnly } from "../middleware.js";
import { sortItems } from "../utils.js";


//Get all assigned Items (Instruments/PCs/Ports)
router.get('/api/assigned-items', async (req, res) => {
  try {
      let instruments = await Instrument.find({
        room_id: { $exists: true }
      })
      // .select("-__v")
      // .populate('room_id', 'name floor_id');
      .select("-__v")
      .populate({
        path: 'room_id',
        select: 'name floor_id',
        populate: {
          path: 'floor_id',
          select: 'level building_id',
          populate: {
            path: 'building_id',
            select: 'name', 
          }
        }
      });
      instruments = sortItems(instruments);

      let pcs = await PC.find({
        room_id: { $exists: true }
      })
      // .select("-__v")
      // .populate('room_id', 'name floor_id');
      .select("-__v")
      .populate({
        path: 'room_id',
        select: 'name floor_id',
        populate: {
          path: 'floor_id',
          select: 'level building_id',
          populate: {
            path: 'building_id',
            select: 'name', 
          }
        }
      });
      pcs = sortItems(pcs);

      let ports = await NetworkPoint.find({
        room_id: { $exists: true }
      })
      // .select("-__v")
      // .populate('room_id', 'name floor_id');
      .select("-__v")
      .populate({
        path: 'room_id',
        select: 'name floor_id',
        populate: {
          path: 'floor_id',
          select: 'level building_id',
          populate: {
            path: 'building_id',
            select: 'name', 
          }
        }
      });
      ports = sortItems(ports);

      const assignedItems = [
        ...instruments.map(instrument => ({
            _id: instrument._id,
            type: "Instrument",
            name: instrument.name,
            room_id: instrument.room_id._id,
            roomName: instrument.room_id.name,
            // floor_id: instrument.room_id.floor_id,
            floor_id: instrument.room_id.floor_id._id,
            floorLevel: instrument.room_id.floor_id.level,
            buildingName: instrument.room_id.floor_id.building_id.name
        })),
        ...pcs.map(pc => ({
            _id: pc._id,
            type: "PC",
            name: pc.name,
            room_id: pc.room_id._id,
            roomName: pc.room_id.name,
            floor_id: pc.room_id.floor_id._id,
            floorLevel: pc.room_id.floor_id.level,
            buildingName: pc.room_id.floor_id.building_id.name
        })),
        ...ports.map(port => ({
            _id: port._id,
            type: "Network point",
            name: port.name,
            room_id: port.room_id._id,
            roomName: port.room_id.name,
            floor_id: port.room_id.floor_id._id,
            floorLevel: port.room_id.floor_id.level,
            buildingName: port.room_id.floor_id.building_id.name
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

    let pcs = await PC.find({ room_id: room._id})
      .select('-room_id -__v');
    pcs = sortItems(pcs);

    let ports = await NetworkPoint.find({ room_id: room._id })
      .select('-room_id -__v');
    ports = sortItems(ports);

    let instruments = await Instrument.find({ room_id: room._id })
      .select('-__v -room_id')
      .populate('connectedTo', 'name'); 
    instruments = sortItems(instruments);

      // Modify the instruments array to only contain the name of the connected PC
      const modifiedInstruments = instruments.map(instrument => ({
          _id: instrument._id,
          name: instrument.name,
          bmram: instrument.bmram,
          actionRequired: instrument.actionRequired,
          note: instrument.note,
          connectedTo: instrument.connectedTo ? instrument.connectedTo.name : null
      }));
              
      const roomItems = {
          roomId: room._id,
          roomName: room.name,
          roomType: room.type,
          roomNr: room.roomNr ? room.roomNr : null,
          instruments: modifiedInstruments,
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
router.patch('/api/itemToRoom', adminOnly, async (req, res) => {
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
 router.patch('/api/removeItemfromRoom', adminOnly, async (req, res) => {
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

    // When unassign an instrument from Room, it will remove any connected PC.
    if(itemType === "Instrument"){
      item.connectedTo = null;
    }

    if (itemType === "PC") {
      await Instrument.updateMany({ connectedTo: item._id }, { $set: { connectedTo: null } });
    }
  
	  
		item.room_id = undefined;
		await item.save();
		res.json(item);
  
  
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: 'Failed to unassign Item from Room' });
	}
  });


export default router;