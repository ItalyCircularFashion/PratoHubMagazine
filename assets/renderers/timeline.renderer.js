/* ============================================================
   TIMELINE RENDERER
   assets/renderers/timeline.renderer.js

   @module timeline.renderer
   Public API: renderTimeline
   Internal:   none

   Top-level declaration: adding `export` before `renderTimeline` is
   the only change required during the ES module migration.
   ============================================================ */
window.FDM = window.FDM || {};

/** @param {Array} events - [{date, label, note}], chronological */
function renderTimeline(events){
  return el(`
    <div class="timeline">
      ${events.map(e => `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="timeline-date">${e.date}</div>
            <div class="timeline-label">${e.label}</div>
            ${e.note ? `<div class="timeline-note">${e.note}</div>` : ''}
          </div>
        </div>`).join('')}
    </div>`);
}
