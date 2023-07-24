import Router from "express";
const router = Router();


import Department from "../Model/Department.js";

// Create a new Department
router.post('/api/departments', async (req, res) => {
    try {
      const { name, description, floor_id } = req.body;

      // Check if the name and floor_id combination is already in use
      const existingDepart = await Department.findOne({ name, floor_id });

      if (existingDepart) {
        return res.status(400).json({ error: `Department '${name}' already exists on this floor` });
      }
  
      const department = new Department({
        name,
        description,
        floor_id
      });
  
      const savedDepartment = await department.save();
  
      res.json(savedDepartment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create Department' });
    }
  });
  
  // Get all Departments
  router.get('/api/departments', async (req, res) => {
    try {
      const departments = await Department.find();
  
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
  router.patch('/api/departments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateFields = { ...req.body }; // Copy all properties from req.body

        console.log("updateFields", updateFields);

        const originalDepartment = await Department.findById(id);

        const isSame = ( 
          updateFields.name === originalDepartment.name && 
          updateFields.color === originalDepartment.color && 
           JSON.stringify(updateFields.position) === JSON.stringify(originalDepartment.position)
      )
      if (isSame) {
        console.log("is the same");
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
        
        console.log("after update", department);
        res.json(department);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update Department' });
    }
  });
  
  // Delete a Department
  router.delete('/api/departments/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const department = await Department.findByIdAndDelete(id);
  
      if (!department) {
        return res.status(404).json({ error: 'Department not found' });
      }
  
      res.json({ message: 'Department deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete Department' });
    }
});
  
export default router;