/* ============================================================
import { getCurrentUser, isAuthenticated, login, logout, setMockUser, MOCK_USERS } from '../services/auth.js';
import { gateOrCta } from '../components/ui.js';
import { isBookmarked, toggleBookmark } from '../services/session.service.js';
import { canBookmark } from '../permissions/permissions.js';
   SHARE / BOOKMARK COMPONENT
   assets/components/share.component.js
   ============================================================ */

(function(){

  function mount(containerId, content){
    const container = document.getElementById(containerId);
    if(!container) return;

    function render(){
      const user = getCurrentUser();
      const canBookmarkResult = canBookmark(user);
      const bookmarked = canBookmarkResult && isBookmarked(content.targetType, content.targetId);

      container.innerHTML = `
        <div class="share-panel">
          <button class="share-btn share-native" aria-label="Share">↗ Share</button>
          <button class="share-btn share-copy" aria-label="Copy link">⎘ Copy Link</button>
          ${canBookmarkResult
            ? `<button class="share-btn share-bookmark ${bookmarked?'is-active':''}" aria-pressed="${bookmarked}">🔖 ${bookmarked?'Saved':'Save'}</button>`
            : gateOrCta('BOOKMARK', '', 'Sign in to save')}
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
          toggleBookmark(content.targetType, content.targetId);
          render();
        });
      }
    }

    render();
    document.addEventListener('fdm:authchange', render);
  }

})();