/* ============================================================
   COMMENT SERVICE
   assets/services/comment.service.js
   Single place that knows how comments are stored and how an
   author id resolves to a user. article.html (and later
   discussion/question pages) only call mountThreadFor().
   ============================================================ */
window.FDM = window.FDM || {};

(function(){

  function getCommentsFor(targetType, targetId){
    return (FDM.data.comments || []).filter(c => c.targetType === targetType && c.targetId === targetId);
  }

  /** Resolves a comment author id. Delegates to the knowledge graph's generic identity resolver. */
  function resolveAuthor(authorId){
    return FDM.knowledgeGraph.findUser(authorId);
  }

  /**
   * Lazily mounts a full comment thread once `containerId` scrolls near.
   * Guarded against being wired twice for the same container.
   * @param {string} containerId
   * @param {'article'|'discussion'|'question'} targetType
   * @param {string} targetId
   * @param {Object} [opts] - passed through to FDM.commentComponent.mountThread
   */
  function mountThreadFor(containerId, targetType, targetId, opts){
    const container = document.getElementById(containerId);
    if(!container || container.dataset.fdmCommentsWired) return;
    container.dataset.fdmCommentsWired = '1';

    let comments = getCommentsFor(targetType, targetId);
    if(opts && opts.excludeId) comments = comments.filter(c => c.id !== opts.excludeId);

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          FDM.commentComponent.mountThread(containerId, comments, resolveAuthor, opts);
          io.disconnect();
        }
      });
    }, {rootMargin:'200px'});
    io.observe(container);
  }

  FDM.commentService = { getCommentsFor, resolveAuthor, mountThreadFor };

})();
