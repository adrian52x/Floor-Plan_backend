import ActivityLog from "../Model/ActivityLog.js";

import Router from "express";
import { adminOnly } from "../middleware.js";
const router = Router();

// Get all Logs
router.get('/api/logs', async (req, res) => {
    try {
      let logs = await ActivityLog.find().populate('user', 'userName');

      res.json(logs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve logs' });
    }
});

// Delete old logs
router.delete('/api/logs', adminOnly, async (req, res) => {
  try {
      // Count the total number of logs
      let totalLogs = await ActivityLog.countDocuments();

      // If there are more than 20 logs, delete the old ones
      if (totalLogs > 1000) {
          // Get the number of logs to delete
          let logsToDeleteCount = totalLogs - 1000;

          // Get the logs to delete
          let logsToDelete = await ActivityLog.find().limit(logsToDeleteCount);

          // Delete the logs
          await ActivityLog.deleteMany({ _id: { $in: logsToDelete.map(log => log._id) } });
      }

      res.status(200).send('Old logs deleted successfully');
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete old logs' });
  }
});


export default router;