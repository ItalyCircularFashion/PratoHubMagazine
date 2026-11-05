/* ============================================================
   IMAGE GALLERY COMPONENT
   assets/components/gallery.component.js
   Heavy component: DOM is only built once the container is
   about to enter the viewport (lazy mount), and every <img>
   uses loading="lazy" on top of that.
   ============================================================ */
window.FDM = window.FDM || {};

(function(){

  /** @param {string} containerId  @param {Array} images - [{src, alt, caption}] */
  function mount(containerId, images){
    const container = document.getElementById(containerId);
    if(!container || !images || !images.length) return;

    let built = false;
    function build(){
      if(built) return;
      built = true;
      container.innerHTML = `
        <div class="gallery-grid">
          ${images.map((img,i) => `
            <button class="gallery-thumb" data-index="${i}" aria-label="Open image ${i+1} of ${images.length}: ${img.alt}">
              <img src="${img.src}" alt="${img.alt}" loading="lazy">
            </button>`).join('')}
        </div>
        <div class="gallery-lightbox" id="${containerId}-lightbox" role="dialog" aria-modal="true" aria-hidden="true">
          <button class="gallery-close" aria-label="Close gallery">✕</button>
          <button class="gallery-prev" aria-label="Previous image">‹</button>
          <figure>
            <img id="${containerId}-lightbox-img" src="" alt="">
            <figcaption id="${containerId}-lightbox-caption"></figcaption>
          </figure>
          <button class="gallery-next" aria-label="Next image">›</button>
        </div>`;

      const lightbox = container.querySelector('.gallery-lightbox');
      const lightboxImg = container.querySelector(`#${containerId}-lightbox-img`);
      const caption = container.querySelector(`#${containerId}-lightbox-caption`);
      let current = 0;

      function open(i){
        current = i;
        lightboxImg.src = images[i].src;
        lightboxImg.alt = images[i].alt;
        caption.textContent = images[i].caption || '';
        lightbox.setAttribute('aria-hidden','false');
        lightbox.classList.add('is-open');
        container.querySelector('.gallery-close').focus();
      }
      function close(){
        lightbox.setAttribute('aria-hidden','true');
        lightbox.classList.remove('is-open');
      }
      function step(delta){
        current = (current + delta + images.length) % images.length;
        open(current);
      }

      container.querySelectorAll('.gallery-thumb').forEach(btn => {
        btn.addEventListener('click', () => open(Number(btn.dataset.index)));
      });
      container.querySelector('.gallery-close').addEventListener('click', close);
      container.querySelector('.gallery-prev').addEventListener('click', () => step(-1));
      container.querySelector('.gallery-next').addEventListener('click', () => step(1));
      lightbox.addEventListener('click', (e) => { if(e.target === lightbox) close(); });
      document.addEventListener('keydown', (e) => {
        if(lightbox.getAttribute('aria-hidden') === 'true') return;
        if(e.key === 'Escape') close();
        if(e.key === 'ArrowLeft') step(-1);
        if(e.key === 'ArrowRight') step(1);
      });
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if(entry.isIntersecting){ build(); io.disconnect(); } });
    }, {rootMargin:'200px'});
    io.observe(container);
  }

  FDM.galleryComponent = { mount };

})();
