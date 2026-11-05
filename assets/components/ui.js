/* ============================================================
   PERMISSION-AWARE UI COMPONENTS
   assets/components/ui.js

   Every page includes this file and gets, for free:
   - an auth-state nav (Sign In/Join for guests, avatar+role
     badge for signed-in users) mounted into #authNav
   - a declarative gating system: any element written as
       <div data-require-capability="COMMENT">...</div>
       <div data-require-role="moderator">...</div>
       <div data-require-guest>...</div>          (visible to guests only)
     is shown or hidden automatically based on the current
     user — no page ever writes its own role/permission logic.
   - a "Preview as" switcher (dev-only) so every permission
     state can be exercised before real auth exists.

   Re-runs automatically on 'fdm:authchange', so switching the
   mock user re-renders every gated element on the page.
   ============================================================ */
window.FDM = window.FDM || {};

(function(){

  const { can, isAtLeast, label, ROLES } = FDM.permissions;

  /** Small role-badge chip, reused by the nav and (later) by comment/byline UI. */
  function renderRoleBadge(user){
    if(!user || user.role === ROLES.GUEST) return '';
    const cls = 'role-badge role-badge--' + user.role;
    return `<span class="${cls}">${label(user.role)}</span>`;
  }

  /** Renders the #authNav mount point: Guest CTA vs signed-in identity. */
  function renderAuthNav(){
    const user=FDM.auth.getCurrentUser();
    return user ? '<span class="auth-link">Interazione locale · '+user.role+'</span>' : '<a href="demo.html" class="auth-link">Prova la community</a>';
  }
  function mountAuthNav(){
    const el = document.getElementById('authNav');
    if(!el) return;
    el.innerHTML = renderAuthNav();
  }

  /**
   * Generic gate: returns true if `node`'s data-require-* attributes
   * allow it to be shown for the current user.
   */
  function isVisibleFor(node, user){
    if(node.hasAttribute('data-require-guest')) return !user;
    const cap = node.getAttribute('data-require-capability');
    if(cap) return can(user, cap);
    const role = node.getAttribute('data-require-role');
    if(role) return isAtLeast(user, role);
    return true;
  }

  /** Sweeps every gated element on the page and shows/hides it for the current user. */
  function applyPermissionVisibility(){
    const user = FDM.auth.getCurrentUser();
    document.querySelectorAll('[data-require-capability], [data-require-role], [data-require-guest]')
      .forEach(node => {
        const visible = isVisibleFor(node, user);
        node.style.display = visible ? '' : 'none';
      });
  }

  /**
   * Generic permission-gated control: shows the real control when the
   * user has `capability`, otherwise shows a "Prova interazioni locali"
   * CTA. Used by the comment composer, vote control, etc.
   * @param {string} capability
   * @param {string} controlHtml
   * @param {string} [ctaLabel]
   */
  function gateOrCta(capability, controlHtml, ctaLabel){
    const user = FDM.auth.getCurrentUser();
    if(can(user, capability)) return controlHtml;
    return `<a class="signin-cta" href="demo.html">${ctaLabel || 'Prova interazioni locali'}</a>`;
  }

  /** Reusable comment/answer composer — gated behind COMMENT capability. */
  function renderCommentComposer(placeholder){
    return gateOrCta('COMMENT', `
      <form class="composer">
        <textarea class="composer-input" rows="3" placeholder="${placeholder || 'Scrivi un commento locale…'}"></textarea>
        <div class="composer-actions">
          <span class="composer-hint">Solo testo · locale · non pubblicato</span>
          <button type="submit" class="btn btn-primary">Post</button>
        </div>
      </form>`, 'Prova risposte locali');
  }

  /** Reusable vote control — gated behind VOTE capability (read-only count for guests). Wired by FDM.interaction.initVoteControls(). */
  function renderVoteControl(count, targetType, targetId){
    const user = FDM.auth.getCurrentUser();
    const enabled = can(user, 'VOTE');
    const voteState = (targetType && targetId) ? FDM.session.getVoteState(targetType, targetId) : null;
    return `
      <div class="vote-control ${enabled ? '' : 'is-disabled'}" data-target-type="${targetType||''}" data-target-id="${targetId||''}">
        <button class="vote-btn ${voteState==='up'?'is-active':''}" data-dir="up" ${enabled ? '' : 'disabled title="Sign in to vote"'}>▲</button>
        <span class="vote-count">${count}</span>
        <button class="vote-btn ${voteState==='down'?'is-active':''}" data-dir="down" ${enabled ? '' : 'disabled title="Sign in to vote"'}>▼</button>
      </div>`;
  }

  /** Dev-only "Preview as" switcher — lets every role's UI be exercised before real auth ships. */
  function mountRoleSwitcher(){
    if(document.getElementById('devRoleSwitcher')) return;
    const wrap = document.createElement('div');
    wrap.className = 'dev-role-switcher';
    wrap.id = 'devRoleSwitcher';
    wrap.innerHTML = `
      <span class="drs-label">Interazioni locali · nessun account</span>
      <select id="devRoleSelect" aria-label="Preview as role">
        <option value="guest">Guest</option>
        <option value="member">Member</option>
        <option value="expert">Verified Expert</option>
        <option value="moderator">Moderator</option>
        <option value="admin">Administrator</option>
      </select>`;
    document.body.appendChild(wrap);
    wrap.querySelector('select').addEventListener('change', (e) => {
      FDM.auth.setMockUser(e.target.value);
    });
  }

  document.addEventListener('fdm:authchange', () => {
    mountAuthNav();
    applyPermissionVisibility();
  });

  mountAuthNav();
  applyPermissionVisibility();
  mountRoleSwitcher();

  FDM.components = {
    renderRoleBadge, renderAuthNav, mountAuthNav,
    applyPermissionVisibility, gateOrCta,
    renderCommentComposer, renderVoteControl, mountRoleSwitcher,
  };

})();
