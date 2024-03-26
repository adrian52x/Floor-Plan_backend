import Router from "express";
const router = Router();
import jwt from "jsonwebtoken";


import Instrument from "../Model/Instrument.js";
import PC from "../Model/PC.js";
import ActivityLog from "../Model/ActivityLog.js";

import { adminOnly, editor } from "../middleware.js";
import { sortItems } from "../utils.js";

// Create a new Instrument
router.post('/api/instruments', editor, async (req, res) => {
    try {
      let { name, bmram, note, connectedTo, room_id } = req.body;

      name = name.trim();

    // Check if the name is already in use
	  const existingInstrument = await Instrument.findOne({ name });

	  if (existingInstrument) {
		  return res.status(409).json({ error: 'This Instrument already exists' });
	  }
  
      const instrument = new Instrument({
        name,
        note,
        bmram,
        connectedTo,
        room_id
      });
  
      const savedInstrument = await instrument.save();

      // Extract the token from the Authorization header
      const token = req.headers.authorization;

      // Decode the token to get the user's ID
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      // Create a new activity log
      const log = new ActivityLog({
        user: decoded.userId,
        userAction: 'Created instrument: ' + savedInstrument.name,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      });

      // Save the activity log
      await log.save();

  
      res.json(savedInstrument);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create Instrument' });
    }
});


// Get all Instruments
router.get('/api/instruments', async (req, res) => {
    try {
      let instruments = await Instrument.find()
        .select("-__v");

      instruments = sortItems(instruments);  

      res.json(instruments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve Instruments' });
    }
});

// Get all Instruments-report
router.post('/api/instruments/filter', async (req, res) => {
  try {
    const { actionRequired, connectedTo, room } = req.body;

    const filter = {};

    if (actionRequired === 'yes') {
      filter.actionRequired = true;
    } else if (actionRequired === 'no') {
      filter.actionRequired = false;
    }

    if (connectedTo === 'yes') {
      filter.connectedTo = { $ne: null };
    } else if (connectedTo === 'no') {
      filter.connectedTo = null;
    }

    if (room === 'yes') {
      filter.room_id = { $ne: undefined };
    } else if (room === 'no') {
      filter.room_id = undefined;
    }

    console.log(filter);

    let instruments = await Instrument.find(filter)
      .select('-__v')
      .populate('room_id')
      .populate('connectedTo');

    instruments = sortItems(instruments);  
     
    const filteredInstruments = instruments.map(instrument => ({
      _id: instrument._id,
      name: instrument.name,
      bmram: instrument.bmram,
      actionRequired: instrument.actionRequired,
      note: instrument.note,
      connectedTo: instrument.connectedTo?.name,
      room_id: instrument.room_id?.name
    }))

    res.json(filteredInstruments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve filtered Instruments' });
  }
});

// Get a specific Instrument
router.get('/api/instruments/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const instrument = await Instrument.findById(id)
        .select("-__v")
        .populate('room_id');

        if (!instrument) {
          return res.status(404).json({ error: 'Instrument not found' });
        }

      const instrumentById = {
        _id: instrument._id,
        name: instrument.name,
        bmram: instrument.bmram,
        actionRequired: instrument.actionRequired,
        note: instrument.note,
        connectedTo: instrument.connectedTo,
        room_id: instrument.room_id ? instrument.room_id._id : null,
        roomName: instrument.room_id ? instrument.room_id.name : null, // Check if room_id exists
      };  
  
      
  
      res.json(instrumentById);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve Instrument' });
    }
});


// Update an Instrument
router.patch('/api/instruments/:id', editor, async (req, res) => {
    try {
      const { id } = req.params;
      const updateFields = { ...req.body }; // Copy all properties from req.body

      if((updateFields.connectedTo !== null && updateFields.connectedTo !== undefined)){
         const connectedToThisPC = await PC.findOne({name: updateFields.connectedTo })

         if(connectedToThisPC) {
          updateFields.connectedTo = connectedToThisPC._id
         } else {
          return res.sendStatus(204);
         }

      }
      
	    const originalInstrument = await Instrument.findById(id);

      const isSame = ( 
        updateFields.name === originalInstrument.name &&
        updateFields.bmram === originalInstrument.bmram &&
        updateFields.note === originalInstrument.note &&
        updateFields.connectedTo?.toString() === originalInstrument.connectedTo?.toString() &&
        updateFields.actionRequired === originalInstrument.actionRequired  
      )

      if (!(updateFields.name === originalInstrument.name)) {
        // Check if the new name is already in use (only if the name is changed)
        const nameAlreadyUsed = await Instrument.findOne({ name: updateFields.name });
        if (nameAlreadyUsed) {
          return res.status(409).json({ error: `Instrument name - '${updateFields.name}' already in use` });
        }
      }


      if (isSame) {
        return res.sendStatus(204); // No changes were made to the instrument
      }

      const instrument = await Instrument.findByIdAndUpdate(
        id,
        updateFields,
        { new: true }
      );
  
      if (!instrument) {
        return res.status(404).json({ error: 'Instrument not found' });
      }


      // Extract the token from the Authorization header
      const token = req.headers.authorization;

      // Decode the token to get the user's ID
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      // Create a new activity log
      const log = new ActivityLog({
        user: decoded.userId,
        userAction: 'Updated instrument: ' + originalInstrument.name,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      });

      // Save the activity log
      await log.save();
  
      res.json(instrument);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: `Failed to update ${updateFields.name}` });
    }
});


// Delete an Instrument
router.delete('/api/instruments/:id', editor, async (req, res) => {
    try {
      const { id } = req.params;

    
      const instrument = await Instrument.findByIdAndDelete(id);
  
      if (!instrument) {
        return res.status(404).json({ error: 'Instrument not found' });
      }


      // Extract the token from the Authorization header
      const token = req.headers.authorization;

      // Decode the token to get the user's ID
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      // Create a new activity log
      const log = new ActivityLog({
        user: decoded.userId,
        userAction: 'Deleted instrument: ' + instrument.name,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      });

      // Save the activity log
      await log.save();
  
      res.json({ message: 'Instrument deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete Instrument' });
    }
});











export default router;