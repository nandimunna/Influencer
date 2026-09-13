import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  ShieldAlert, 
  Key, 
  Lock, 
  CheckCircle2, 
  Clock, 
  User, 
  Layers 
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const AdminSettingsView = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.getAuditLogs();
      if (res.success) {
        setLogs(res.logs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-purple-400" />
          <span>Governance, Security & Audit Trail</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Tamper-evident activity logs, role-based access control policies, and system audit history
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white">Client Privacy Guard</h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">Active</span>
          </div>
          <p className="text-xs text-slate-400">
            Automatically masks creator phone numbers, direct emails, and agency profit margins for Client viewers.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white">JWT Enterprise Auth</h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold">Enforced</span>
          </div>
          <p className="text-xs text-slate-400">
            Stateless 7-day cryptographic session tokens with granular route-level middleware protection.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white">Excel Sync Engine</h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">Real-time</span>
          </div>
          <p className="text-xs text-slate-400">
            Drag-and-drop spreadsheet parser supporting .xlsx, .xls and .csv with automatic duplicate detection.
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white">System Activity Audit Trail</h3>

        {loading ? (
          <div className="py-10 text-center text-xs text-slate-400">Loading audit trail...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-2.5">User & Role</th>
                  <th className="px-4 py-2.5">Action</th>
                  <th className="px-4 py-2.5">Entity</th>
                  <th className="px-4 py-2.5">Details</th>
                  <th className="px-4 py-2.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-2.5">
                      <p className="font-bold text-white">{log.userName}</p>
                      <p className="text-[10px] text-purple-400 font-mono">{log.userRole}</p>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-purple-300 font-semibold">{log.action}</td>
                    <td className="px-4 py-2.5 text-slate-400">{log.entityType}</td>
                    <td className="px-4 py-2.5 text-slate-300 max-w-md truncate">{log.details}</td>
                    <td className="px-4 py-2.5 text-slate-500 font-mono text-[11px]">{formatDate(log.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
