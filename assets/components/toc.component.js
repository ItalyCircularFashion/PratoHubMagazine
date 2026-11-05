/* ============================================================
   TABLE OF CONTENTS + READING PROGRESS COMPONENT
   assets/components/toc.component.js
   ============================================================ */
window.FDM = window.FDM || {};

(function(){

  /**
   * Mounts a sticky TOC into `tocId` from an Article's `sections`,
   * and wires a reading-progress bar (`progressId`) against `articleBodyId`.
   */
  function mount(tocId, sections, articleBodyId, progressId){
    const tocEl = document.getElementById(tocId);
    const bodyEl = document.getElementById(articleBodyId);
    if(tocEl && sections && sections.length){
      tocEl.innerHTML = `
        <div class="toc-label">In This Article</div>
        <nav class="toc-list">
          ${sections.map(s => `<a href="#${s.id}" data-toc-target="${s.id}">${s.heading}</a>`).join('')}
        </nav>`;
      const links = [...tocEl.querySelectorAll('[data-toc-target]')];
      const targets = sections.map(s => document.getElementById(s.id)).filter(Boolean);
      if(targets.length){
        const io = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            const link = tocEl.querySelector(`[data-toc-target="${entry.target.id}"]`);
            if(link) link.classList.toggle('is-active', entry.isIntersecting);
          });
        }, {threshold:.4, rootMargin:'-20% 0px -60% 0px'});
        targets.forEach(t => io.observe(t));
      }
    }

    const progressEl = document.getElementById(progressId);
    if(progressEl && bodyEl){
      const update = () => {
        const rect = bodyEl.getBoundingClientRect();
        const total = bodyEl.offsetHeight - window.innerHeight;
        const scrolled = Math.min(Math.max(-rect.top, 0), total);
        const pct = total > 0 ? Math.round((scrolled/total)*100) : 0;
        progressEl.style.width = pct + '%';
      };
      window.addEventListener('scroll', update, {passive:true});
      window.addEventListener('resize', update);
      update();
    }
  }

  FDM.tocComponent = { mount };

})();
