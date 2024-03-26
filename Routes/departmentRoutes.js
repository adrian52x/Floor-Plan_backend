import Router from "express";
const router = Router();

import jwt from "jsonwebtoken";

import ActivityLog from "../Model/ActivityLog.js";

import Department from "../Model/Department.js";

import { adminOnly, editor } from "../middleware.js";
import { sortItems } from "../utils.js";

// Create a new Department
router.post('/api/departments', editor, async (req, res) => {
    try {
      let { name, description, color, floor_id, position } = req.body;

      name = name.trim();

      // Check if the name and floor_id combination is already in use
      const existingDepart = await Department.findOne({ name, floor_id });

      if (existingDepart) {
        return res.status(409).json({ error: `Department - '${name}' already exists on this floor` });
      }
  
      const department = new Department({
        name,
        description,
        color,
        floor_id,
        position
      });
  
      const savedDepartment = await department.save();

      // Extract the token from the Authorization header
      const token = req.headers.authorization;

      // Decode the token to get the user's ID
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      // Create a new activity log
      const log = new ActivityLog({
        user: decoded.userId,
        userAction: 'Created department: ' + savedDepartment.name,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      });

      // Save the activity log
      await log.save();
  
      res.json(savedDepartment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create Department' });
    }
  });
  
  // Get all Departments
  router.get('/api/departments', async (req, res) => {
    try {
      let departments = await Department.find();

      departments = sortItems(departments); 
  
      res.json(departments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve Departments' });
    }
  });
  
  // Get a specific Department
  router.get('/api/departments/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const department = await Department.findById(id);
  
      if (!department) {
        return res.status(404).json({ error: 'Department not found' });
      }
  
      res.json(department);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve Department' });
    }
  });
  
  // Update a Department
  router.patch('/api/departments/:id', editor, async (req, res) => {
    try {
        const { id } = req.params;
        const updateFields = { ...req.body }; // Copy all properties from req.body

        const originalDepartment = await Department.findById(id);

        const isSame = ( 
          updateFields.name === originalDepartment.name && 
          updateFields.color === originalDepartment.color && 
           JSON.stringify(updateFields.position) === JSON.stringify(originalDepartment.position)
      )

      
      if (isSame) {
        return res.sendStatus(204); // No changes were made to the room
      }
    
        const department = await Department.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        );
    
        if (!department) {
            return res.status(404).json({ error: 'Department not found' });
        }

        // Extract the token from the Authorization header
      const token = req.headers.authorization;

      // Decode the token to get the user's ID
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      // Create a new activity log
      const log = new ActivityLog({
        user: decoded.userId,
        userAction: 'Updated department: ' + originalDepartment.name,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      });

      // Save the activity log
      await log.save();
      
        res.json(department);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update Department' });
    }
  });
  
  // Delete a Department
  router.delete('/api/departments/:id', editor, async (req, res) => {
    try {
      const { id } = req.params;
  
      const department = await Department.findByIdAndDelete(id);
  
      if (!department) {
        return res.status(404).json({ error: 'Department not found' });
      }

      // Extract the token from the Authorization header
      const token = req.headers.authorization;

      // Decode the token to get the user's ID
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      // Create a new activity log
      const log = new ActivityLog({
        user: decoded.userId,
        userAction: 'Deleted department: ' + department.name,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      });

      // Save the activity log
      await log.save();
  
      res.json({ message: 'Department deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete Department' });
    }
});
  
export default router;