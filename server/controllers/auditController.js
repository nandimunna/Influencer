import { db } from '../db/database.js';

export const getAuditLogs = (req, res) => {
  try {
    const logs = db.get('auditLogs');
    return res.json({ success: true, count: logs.length, logs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
