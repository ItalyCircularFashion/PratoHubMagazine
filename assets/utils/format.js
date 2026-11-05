/* ============================================================
   FORMAT UTILS
   assets/utils/format.js
   ============================================================ */
window.FDM = window.FDM || {};
FDM.utils = FDM.utils || {};

/** "2026-06-20T10:00:00Z" -> "3d ago" / "Just now" / "2h ago" */
FDM.utils.formatRelativeTime = function formatRelativeTime(iso){
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if(mins < 1) return 'Just now';
  if(mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if(hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if(days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  return `${months}mo ago`;
};

/** "2026-06-24T09:00:00Z" -> "Jun 24" */
FDM.utils.formatDate = function formatDate(iso){
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month:'short', day:'numeric' });
};

/** 2400 -> "2.4k", 950 -> "950" */
FDM.utils.formatCompactNumber = function formatCompactNumber(n){
  if(n >= 1000) return (n/1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k';
  return String(n);
};
