
import Router from "express";
const router = Router();

import jwt from "jsonwebtoken";

import NetworkPoint from "../Model/NetworkPoint.js";
import { adminOnly, editor } from "../middleware.js";
import { sortItems } from "../utils.js";
import ActivityLog from "../Model/ActivityLog.js";


// Create a new Network Point
router.post('/api/netports', editor, async (req, res) => {
    try {
      let { name, switchPort, room_id } = req.body;

      name = name.trim();

      // Check if the name is already in use
	  const existingPort = await NetworkPoint.findOne({ name });

	  if (existingPort) {
		  return res.status(409).json({ error: 'This Network Port already exists' });
	  }
  
      const networkPoint = new NetworkPoint({
        name,
        switchPort,
        room_id
      });
  
      const savedNetworkpoint = await networkPoint.save();


      // Extract the token from the Authorization header
      const token = req.headers.authorization;

      // Decode the token to get the user's ID
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      // Create a new activity log
      const log = new ActivityLog({
        user: decoded.userId,
        userAction: 'Created network-point: ' + savedNetworkpoint.name,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      });

      // Save the activity log
      await log.save();
  
      res.json(savedNetworkpoint);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create PORT' });
    }
  });


  // Get all Network Points
  router.get('/api/netports', async (req, res) => {
    try {
      let networkPoints = await NetworkPoint.find()
      .select("-__v");

      networkPoints = sortItems(networkPoints);


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
router.patch('/api/netports/:id', editor, async (req, res) => {
  try {
    const { id } = req.params;
    let updateFields = { ...req.body }; // Copy all properties from req.body

    updateFields.name = updateFields.name.trim();


    const originalNetworkPoint = await NetworkPoint.findById(id);

    const isSame = ( 
      updateFields.name === originalNetworkPoint.name &&
      updateFields.switchPort === originalNetworkPoint.switchPort 
    )

    if (!(updateFields.name === originalNetworkPoint.name)) {
      // Check if the new name is already in use (only if the name is changed)
      const nameAlreadyUsed = await NetworkPoint.findOne({ name: updateFields.name })
      if (nameAlreadyUsed) {
        return res.status(409).json({ error: `Network point name - '${updateFields.name}' already in use` });
      }
    }


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


    // Extract the token from the Authorization header
    const token = req.headers.authorization;

    // Decode the token to get the user's ID
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Create a new activity log
    const log = new ActivityLog({
      user: decoded.userId,
      userAction: 'Updated network-point: ' + originalNetworkPoint.name,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    });

    // Save the activity log
    await log.save();

    res.json(networkPoint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update Network Point' });
  }
});

// Delete a Network Point
router.delete('/api/netports/:id', editor, async (req, res) => {
  try {
    const { id } = req.params;

  
    const networkPoint = await NetworkPoint.findByIdAndDelete(id);

    if (!networkPoint) {
      return res.status(404).json({ error: 'Network Point not found' });
    }


    // Extract the token from the Authorization header
    const token = req.headers.authorization;

    // Decode the token to get the user's ID
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Create a new activity log
    const log = new ActivityLog({
      user: decoded.userId,
      userAction: 'Deleted network-point: ' + networkPoint.name,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    });

    // Save the activity log
    await log.save();

    res.json({ message: 'Network Point deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete Network Point' });
  }
});








export default router;