
// Page tear transition (PPT-style)
(function(){
  const overlay = document.createElement('div');
  overlay.id = 'page-transition';
  document.body.appendChild(overlay);

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;
    if (href.startsWith('http')) return;
    if (href.startsWith('#')) return;
    if (a.target === '_blank') return;

    e.preventDefault();
    document.body.classList.add('is-exiting');
    setTimeout(() => {
      window.location.assign(href);
    }, 320);
  });
})();
