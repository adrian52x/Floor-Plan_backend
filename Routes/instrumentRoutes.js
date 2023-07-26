import Router from "express";
const router = Router();


import Instrument from "../Model/Instrument.js";
import RoomInstrument from "../Model/RoomInstrument.js";

// Create a new Instrument
router.post('/api/instruments', async (req, res) => {
    try {
      const { name, description } = req.body;

    // Check if the name is already in use
	  const existingInstrument = await Instrument.findOne({ name });

	  if (existingInstrument) {
		  return res.status(400).json({ error: 'This Instrument already exists' });
	  }
  
      const instrument = new Instrument({
        name,
        description
      });
  
      const savedInstrument = await instrument.save();
  
      res.json(savedInstrument);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create Instrument' });
    }
  });
  
  // Get all Instruments
  router.get('/api/instruments', async (req, res) => {
    try {
      const instruments = await Instrument.find();
  
      res.json(instruments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve Instruments' });
    }
  });
  
  // Get a specific Instrument
  router.get('/api/instruments/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const instrument = await Instrument.findById(id);
  
      if (!instrument) {
        return res.status(404).json({ error: 'Instrument not found' });
      }
  
      res.json(instrument);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve Instrument' });
    }
  });
  
  // Update an Instrument
  router.patch('/api/instruments/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updateFields = { ...req.body }; // Copy all properties from req.body


	    const originalInstrument = await Instrument.findById(id);

      const isSame = ( 
        updateFields.name === originalInstrument.name )
      if (isSame) {
        console.log("is the same");
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
  
      res.json(instrument);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update Instrument' });
    }
  });
  
  // Delete an Instrument
  router.delete('/api/instruments/:id', async (req, res) => {
    try {
      const { id } = req.params;

      // Delete the RoomInstruments entries associated with the Instrument
	    await RoomInstrument.deleteMany({ instrumentId: id });
  
      const instrument = await Instrument.findByIdAndDelete(id);
  
      if (!instrument) {
        return res.status(404).json({ error: 'Instrument not found' });
      }
  
      res.json({ message: 'Instrument deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete Instrument' });
    }
});
  
export default router;