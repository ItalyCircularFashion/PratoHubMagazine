/* ============================================================
   VALIDATION UTILS
   assets/utils/validation.js
   ============================================================ */
window.FDM = window.FDM || {};
FDM.utils = FDM.utils || {};

FDM.utils.validateEmail = function(value){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value||'').trim());
};
/** Nickname is the mandatory public identity: 3-24 chars, letters/numbers/._- */
FDM.utils.validateNickname = function(value){
  return /^[a-zA-Z0-9._-]{3,24}$/.test(String(value||'').trim());
};
FDM.utils.validatePassword = function(value){
  return String(value||'').length >= 8;
};
FDM.utils.validateRequired = function(value){
  return String(value||'').trim().length > 0;
};
