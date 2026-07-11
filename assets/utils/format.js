/* ============================================================
   FORMAT UTILS
   assets/utils/format.js
   ============================================================ */

export function formatRelativeTime(iso){
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
}

export function formatDate(iso){
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month:'short', day:'numeric' });
}

export function formatCompactNumber(n){
  if(n >= 1000) return (n/1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k';
  return String(n);
}

/* ---- Compatibility bridge ---- */