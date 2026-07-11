/* ============================================================
   VALIDATION UTILS
   assets/utils/validation.js
   ============================================================ */

export function validateEmail(value){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value||'').trim());
}

export function validateNickname(value){
  return /^[a-zA-Z0-9._-]{3,24}$/.test(String(value||'').trim());
}

export function validatePassword(value){
  return String(value||'').length >= 8;
}

export function validateRequired(value){
  return String(value||'').trim().length > 0;
}

/* ---- Compatibility bridge ---- */