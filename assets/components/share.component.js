/* ============================================================
   SHARE / BOOKMARK COMPONENT
   assets/components/share.component.js
   ============================================================ */
window.FDM = window.FDM || {};

(function(){

  function mount(containerId, content){
    const container = document.getElementById(containerId);
    if(!container) return;

    function render(){
      const user = FDM.auth.getCurrentUser();
      const canBookmark = FDM.permissions.canBookmark(user);
      const isBookmarked = canBookmark && FDM.session.isBookmarked(content.targetType, content.targetId);

      container.innerHTML = `
        <div class="share-panel">
          <button class="share-btn share-native" aria-label="Share">↗ Share</button>
          <button class="share-btn share-copy" aria-label="Copy link">⎘ Copy Link</button>
          ${canBookmark
            ? `<button class="share-btn share-bookmark ${isBookmarked?'is-active':''}" aria-pressed="${isBookmarked}">🔖 ${isBookmarked?'Saved':'Save'}</button>`
            : FDM.components.gateOrCta('BOOKMARK', '', 'Sign in to save')}
          <span class="share-copy-feedback" aria-live="polite"></span>
        </div>`;

      container.querySelector('.share-native').addEventListener('click', async () => {
        const shareData = { title: content.title, url: content.url };
        if(navigator.share){
          try { await navigator.share(shareData); } catch(e){ /* user cancelled */ }
        } else {
          copyLink();
        }
      });
      container.querySelector('.share-copy').addEventListener('click', copyLink);
      async function copyLink(){
        const feedback = container.querySelector('.share-copy-feedback');
        try {
          await navigator.clipboard.writeText(content.url);
          feedback.textContent = 'Link copied';
        } catch(e){
          feedback.textContent = content.url;
        }
        setTimeout(() => feedback.textContent = '', 2500);
      }

      const bookmarkBtn = container.querySelector('.share-bookmark');
      if(bookmarkBtn){
        bookmarkBtn.addEventListener('click', () => {
          FDM.session.toggleBookmark(content.targetType, content.targetId);
          render();
        });
      }
    }

    render();
    document.addEventListener('fdm:authchange', render);
  }

  FDM.shareComponent = { mount };

})();
