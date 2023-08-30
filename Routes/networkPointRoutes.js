
import Router from "express";
const router = Router();


import NetworkPoint from "../Model/NetworkPoint.js";


// Create a new Network Point
router.post('/api/netports', async (req, res) => {
    try {
      const { portName, switchPort, room_id } = req.body;

      // Check if the name is already in use
	  const existingPort = await NetworkPoint.findOne({ portName });

	  if (existingPort) {
		  return res.status(400).json({ error: 'This Network Port already exists' });
	  }
  
      const networkPoint = new NetworkPoint({
        portName,
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
    //     portName: item.portName,
    //     swithcPort: item.swithcPort,
    //     room: item.room_id ? item.room_id.name : null, // Check if room_id exists
    // }));

      
  
      res.json(networkPoints);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve Network Points' });
    }
  });











export default router;