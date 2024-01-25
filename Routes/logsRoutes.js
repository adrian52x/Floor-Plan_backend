import ActivityLog from "../Model/ActivityLog.js";

import Router from "express";
const router = Router();

// Get all Logs
router.get('/api/logs', async (req, res) => {
    try {
      let logs = await ActivityLog.find()

      res.json(logs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve logs' });
    }
});


export default router;