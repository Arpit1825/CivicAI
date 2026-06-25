import React from 'react';
import { ShieldCheck, AlertCircle, RefreshCw, CheckCircle2, Clock } from 'lucide-react';

export default function StatusBadge({ type, value }) {
  if (type === 'severity') {
    const severityStyles = {
      Low: 'bg-green-50 text-green-700 border-green-200',
      Medium: 'bg-amber-50 text-amber-700 border-amber-200',
      High: 'bg-orange-50 text-orange-700 border-orange-200',
      Critical: 'bg-red-50 text-red-700 border-red-200 animate-pulse-slow',
    };

    const style = severityStyles[value] || 'bg-slate-50 text-slate-700 border-slate-200';
    return (
      <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
        <span class="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
        {value}
      </span>
    );
  }

  if (type === 'status') {
    const statusConfig = {
      Reported: {
        styles: 'bg-slate-50 text-slate-700 border-slate-200',
        icon: Clock
      },
      Verified: {
        styles: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        icon: ShieldCheck
      },
      'In Progress': {
        styles: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: RefreshCw
      },
      Resolved: {
        styles: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: CheckCircle2
      }
    };

    const config = statusConfig[value] || { styles: 'bg-slate-50 text-slate-700 border-slate-200', icon: Clock };
    const Icon = config.icon;

    return (
      <span class={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.styles}`}>
        <Icon class="h-3.5 w-3.5" />
        <span>{value}</span>
      </span>
    );
  }

  return null;
}
