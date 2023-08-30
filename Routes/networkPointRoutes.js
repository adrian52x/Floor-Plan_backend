
import Router from "express";
const router = Router();


import NetworkPoint from "../Model/NetworkPoint.js";


// Create a new Network Point
router.post('/api/netports', async (req, res) => {
    try {
      const { name, switchPort, room_id } = req.body;

      // Check if the name is already in use
	  const existingPort = await NetworkPoint.findOne({ name });

	  if (existingPort) {
		  return res.status(400).json({ error: 'This Network Port already exists' });
	  }
  
      const networkPoint = new NetworkPoint({
        name,
        switchPort,
        room_id
      });
  
      const savedNetworkpoint = await networkPoint.save();
  
      res.json(savedNetworkpoint);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create PORT' });
    }
  });


  // Get all Network Points
  router.get('/api/netports', async (req, res) => {
    try {
      const networkPoints = await NetworkPoint.find()
      .select("-__v");


    // Map the results to create a new array with the modified objects
    // const modifiedNetworkPoints = networkPoints.map(item => ({
    //     _id: item._id,
    //     name: item.name,
    //     swithcPort: item.swithcPort,
    //     room: item.room_id ? item.room_id.name : null, // Check if room_id exists
    // }));

      
  
      res.json(networkPoints);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve Network Points' });
    }
  });

  // Get a specific network point
router.get('/api/netports/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const networkPoint = await NetworkPoint.findById(id)
      .select("-__v")
      .populate('room_id');

      if (!networkPoint) {
        return res.status(404).json({ error: 'Network Point not found' });
      }

    const networkPointById = {
      _id: networkPoint._id,
      name: networkPoint.name,
      switchPort: networkPoint.switchPort,
      room_id: networkPoint.room_id ? networkPoint.room_id._id : null,
      roomName: networkPoint.room_id ? networkPoint.room_id.name : null, // Check if room_id exists
    };  

    
    res.json(networkPointById);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve Instrument' });
  }
});


// Update a Network Point
router.patch('/api/netports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = { ...req.body }; // Copy all properties from req.body


    const originalNetworkPoint = await NetworkPoint.findById(id);

    const isSame = ( 
      updateFields.name === originalNetworkPoint.name &&
      updateFields.switchPort === originalNetworkPoint.switchPort 
    )
    if (isSame) {
      return res.sendStatus(204); // No changes were made to the instrument
    }

    const networkPoint = await NetworkPoint.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!networkPoint) {
      return res.status(404).json({ error: 'Network Point not found' });
    }

    res.json(networkPoint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update Network Point' });
  }
});

// Delete a Network Point
router.delete('/api/netports/:id', async (req, res) => {
  try {
    const { id } = req.params;

  
    const networkPoint = await NetworkPoint.findByIdAndDelete(id);

    if (!networkPoint) {
      return res.status(404).json({ error: 'Network Point not found' });
    }

    res.json({ message: 'Network Point deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete Network Point' });
  }
});








export default router;