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


      // Process the instruments to include floor_id directly
      const instrumentsWithFloorId = instruments.map(instrument => {
        return {
            _id: instrument._id,
            type: "Instrument",
            name: instrument.name,
            //bmram: instrument.bmram,
            //lansweeper: instrument.lansweeper,
            //actionRequired: instrument.actionRequired,
            room_id: instrument.room_id._id,
            roomName: instrument.room_id.name,
            floor_id: instrument.room_id.floor_id
        };
      });

      // Process the pcs to include floor_id directly
      const pcsWithFloorId = pcs.map(pc => {
        return {
            _id: pc._id,
            type: "PC",
            name: pc.name,
           // lansweeper: pc.lansweeper,
            room_id: pc.room_id._id,
            roomName: pc.room_id.name,
            floor_id: pc.room_id.floor_id
        };
      });

      // Process the ports to include floor_id directly
      const portsWithFloorId = ports.map(port => {
        return {
            _id: port._id,
            type: "Network point",
            name: port.portName,
            room_id: port.room_id._id,
            roomName: port.room_id.name,
            floor_id: port.room_id.floor_id
        };
      });

    res.json(instrumentsWithFloorId, pcsWithFloorId, portsWithFloorId); // ??????????



    //res.json(instruments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve Instruments' });
  }
});

// Get all Instruments/PCs/Ports associeted with a specific Room
router.get('/api/1room-instruments', async (req, res) => {
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

// Assign Instrument to Room
router.patch('/api/instrumentToRoom', async (req, res) => {
    try {
      const { roomId, instrumentId } = req.body;

    // Check if room and instrument exist
    const roomExists = await Room.exists({ _id: roomId });
    const instrumentExists = await Instrument.exists({ _id: instrumentId });

    if (!roomExists || !instrumentExists) {
      return res.status(404).json({ error: 'Room or instrument not found' });
    }

    // Check if an instrument with the same ID already exists in the room
    const instrumentAlreadyExists = await Instrument.exists({ _id:instrumentId, room_id: roomId });

    if (instrumentAlreadyExists) {
      return res.status(400).json({ error: 'This instrument already exists in this room' });
    }

    const instrumentAlreadyInUse = await Instrument.findById(instrumentId);

    if (!instrumentAlreadyInUse) {
        return res.status(404).json({ error: 'Instrument not found' });
    }
    console.log(instrumentAlreadyInUse.room_id);

    if (instrumentAlreadyInUse.room_id === undefined) {
        // check if instrument is not assigned to any room
        instrumentAlreadyInUse.room_id = roomId;
        await instrumentAlreadyInUse.save();
        res.json(instrumentAlreadyInUse);
    } else {
        return res.status(400).json({ error: 'This instrument already exists in a different room' });
    }
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to assign Instrument to Room' });
    }
  });


  // UnAssign Instrument from Room
router.patch('/api/removeInstrumentfromRoom', async (req, res) => {
  try {
    const { roomId, instrumentId } = req.body;

    const roomInstrument = await Instrument.findOne({ room_id: roomId, _id: instrumentId });
  
      //console.log(roomInstrument);
      if (!roomInstrument) {
        return res.status(404).json({ error: 'Room-Instrument entry not found' });
      }

      roomInstrument.room_id = undefined;
      await roomInstrument.save();
      res.json(roomInstrument);


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to unassign Instrument from Room' });
  }
});


// Assign PC to Room
// UnAssign PC from Room

// Assign Network Point to Room
// UnAssign Network Point from Room





export default router;