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




  export default router;