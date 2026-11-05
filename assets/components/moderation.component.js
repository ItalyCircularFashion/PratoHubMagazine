/* ============================================================
   MODERATION COMPONENT
   assets/components/moderation.component.js
   Renders nothing for non-moderators. Mutates the in-memory
   model directly (no backend yet) and re-renders on change.
   ============================================================ */
window.FDM = window.FDM || {};

(function(){

  function mountToolbar(containerId, discussion){
    const container = document.getElementById(containerId);
    if(!container) return;

    function render(){
      const user = FDM.auth.getCurrentUser();
      if(!FDM.permissions.canModerateDiscussion(user)){ container.innerHTML = ''; return; }
      container.innerHTML = `
        <div class="moderation-toolbar">
          <span class="moderation-label">Moderator Tools</span>
          <button class="btn btn-line mod-action" data-action="lock">${discussion.moderationStatus==='locked'?'Unlock':'Lock'} Thread</button>
          <button class="btn btn-line mod-action" data-action="pin">${discussion.isPinned?'Unpin':'Pin'} Discussion</button>
        </div>`;
      container.querySelectorAll('.mod-action').forEach(btn => btn.addEventListener('click', () => {
        const u = FDM.auth.getCurrentUser();
        if(btn.dataset.action === 'lock' && FDM.permissions.canLockDiscussion(u)){
          discussion.moderationStatus = discussion.moderationStatus === 'locked' ? 'open' : 'locked';
        }
        if(btn.dataset.action === 'pin' && FDM.permissions.canPinDiscussion(u)){
          discussion.isPinned = !discussion.isPinned;
        }
        render();
        document.dispatchEvent(new CustomEvent('fdm:discussionchange', { detail:{ discussion } }));
      }));
    }

    render();
    document.addEventListener('fdm:authchange', render);
  }

  FDM.moderationComponent = { mountToolbar };

})();
