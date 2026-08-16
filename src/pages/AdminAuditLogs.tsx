import React from 'react';
import type { AuditLog } from '../types';
import { History, Shield, Clock } from 'lucide-react';

interface AdminAuditLogsProps {
  logs: AuditLog[];
}

export const AdminAuditLogs: React.FC<AdminAuditLogsProps> = ({ logs }) => {
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <History className="w-6 h-6 text-amber-500" />
            <span>Administrator Security Audit Trail</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable system activity log recording inventory changes, price updates, user events, and settings.
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider">
                <th className="py-4 px-4">Timestamp</th>
                <th className="py-4 px-4">Admin Email</th>
                <th className="py-4 px-4">Action</th>
                <th className="py-4 px-4">Item / Target</th>
                <th className="py-4 px-4">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/50 transition">
                  <td className="py-3.5 px-4 text-slate-400 font-mono flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>
                      {new Date(log.created_at).toLocaleDateString('en-GB')} {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-white">
                    <span className="inline-flex items-center space-x-1">
                      <Shield className="w-3 h-3 text-amber-400" />
                      <span>{log.admin_email}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 font-mono font-bold text-[10px] uppercase border border-amber-500/20">
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-200">{log.item}</td>
                  <td className="py-3.5 px-4 text-slate-300">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
