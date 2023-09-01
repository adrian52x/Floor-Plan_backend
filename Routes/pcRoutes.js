import Router from "express";
const router = Router();


import PC from "../Model/PC.js";

// Create a new PC
router.post('/api/pcs', async (req, res) => {
    try {
      const { name, lansweeper, room_id } = req.body;

      // Check if the name is already in use
	  const existingPC = await PC.findOne({ name });

	  if (existingPC) {
		  return res.status(400).json({ error: 'This PC already exists' });
	  }
  
      const pc = new PC({
        name,
        lansweeper,
        room_id
      });
  
      const savedPC = await pc.save();
  
      res.json(savedPC);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create PC' });
    }
  });


  // Get all PCs
  router.get('/api/pcs', async (req, res) => {
    try {
      const pcs = await PC.find()
      .select("-__v");


    // Map the results to create a new array with the modified objects
    // const modifiedPCs = pcs.map(item => ({
    //     _id: item._id,
    //     name: item.name,
    //     lansweeper: item.lansweeper,
    //     room: item.room_id ? item.room_id.name : null, // Check if room_id exists
    // }));

      
  
      res.json(pcs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve PCs' });
    }
  });


  // Get a specific PC
router.get('/api/pcs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const pc = await PC.findById(id)
      .select("-__v")
      .populate('room_id');

      if (!pc) {
        return res.status(404).json({ error: 'PC not found' });
      }

    const pcById = {
      _id: pc._id,
      name: pc.name,
      lansweeper: pc.lansweeper,
      room_id: pc.room_id ? pc.room_id._id : null,
      roomName: pc.room_id ? pc.room_id.name : null, // Check if room_id exists
    };  

    
    res.json(pcById);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve Instrument' });
  }
});

  // Update a PC
router.patch('/api/pcs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = { ...req.body }; // Copy all properties from req.body


    const originalPC = await PC.findById(id);

    const isSame = ( 
      updateFields.name === originalPC.name &&
      updateFields.lansweeper === originalPC.lansweeper 
    )
    if (isSame) {
      return res.sendStatus(204); // No changes were made to the instrument
    }

    const pc = await PC.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!pc) {
      return res.status(404).json({ error: 'PC not found' });
    }

    res.json(pc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update PC' });
  }
});


// Delete a PC
router.delete('/api/pcs/:id', async (req, res) => {
  try {
    const { id } = req.params;

  
    const pc = await PC.findByIdAndDelete(id);

    if (!pc) {
      return res.status(404).json({ error: 'PC not found' });
    }

    res.json({ message: 'PC deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete PC' });
  }
});



  export default router;