import Router from "express";
const router = Router();

import Object from "../Model/buildingObject.js";
//import { verifyPlateNumber, adminOnly } from "../middleware.js";




//Get all objects
router.get("/api/objects", async (req, res) => {
  try {
    const objects = await Object.find();
    if (!objects) {
      throw new Error("No objects");
    }
    res
      .status(200)
      .json({ Objects: objects });
  } catch (error) {
    res.status(400).json({ message: "something wrong" });
  }
});


//Delete all objects
router.delete("/api/objects", async (req, res) => {
  try {
    const result = await Object.deleteMany();
    res.status(200).json({ message: `Deleted ${result.deletedCount} objects` });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
});



// Find an Object by name
router.get("/api/object/:key", async (req, res) => {
  const { key } = req.params;
  const regex = new RegExp(key, "i");
  try {
    const objects = await Object.find({ name: { $regex: regex } });
    if (!objects) {
      throw new Error("No objects");
    }
    res
      .status(200)
      .json({ Objects: objects });
  } catch (error) {
    res.status(400).json({ message: "something wrong" });
  }
});



// Create an Object
router.post("/api/object", async (req, res) => {
  try {
    const { name, objectType, floor, building, equipment } = req.body;

    // Create building in database
    const object = await Object.create({
      name: name,
      objectType: objectType,
      floor: floor,
      building: building,
      equipment: equipment
    });

    return res.status(201).json(object);
  } catch (err) {
    res.status(400).json({ message: "something wrong" });
  }
});


// Create many Objects at once
router.post('/api/manyObjects', async (req, res) => {
  let count = 0;
  console.log(req.body);
  const objects = req.body;

  // Validate that all required fields are present in each object
  const missingFields = objects.filter(obj => !obj?.name || !obj?.objectType || obj?.floor === undefined || !obj?.building);
  if (missingFields.length > 0) {
    console.log(missingFields);
    return res.status(400).json({ error: `Missing fields: ${missingFields.join(', ')}` });
  }

  // Check if objects already exist in the database
  const updates = [];
  const newObjects = [];
  for (const obj of objects) {
    const existingObj = await Object.findOne({ 
      name: obj.name,
      objectType: obj.objectType,
      floor: obj.floor,
      building: obj.building
    });

    if (existingObj) {
      count++;
      // Update the existing object
      const update = Object.updateOne(
        { _id: existingObj._id },
        { $set: { equipment: obj.equipment } }
      );
      updates.push(update);
    } else {
      // Create a new object
      const newObj = new Object(obj);
      newObjects.push(newObj);
    }
  }

  // Execute the updates and insertions
  await Promise.all(updates);
  const savedNewObjects = await Object.insertMany(newObjects);
  res.status(200).json({ message: `${count} Objects already exist and have been updated`, savedNewObjects });
});



export default router;