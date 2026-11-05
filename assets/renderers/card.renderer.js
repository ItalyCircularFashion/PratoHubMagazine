/* ============================================================
   CARD RENDERERS
   assets/renderers/card.renderer.js

   @module card.renderer
   Public API (every function below is a named export candidate):
     el, renderRoleBadge, renderAgendaCard, renderNewsCard, renderPick,
     renderDiscussionRow, renderQuestionCard, renderEventCard, renderEventCardFull,
     renderAuthorCard, renderUserCard, renderCommentItem, renderCompanyCard,
     renderVerifyCompanyLink, renderNotificationItem, renderEmptyState,
     renderErrorState, renderStatStrip, mountKgPanel, adaptQuestionForCard,
     renderKgDiscussionItem, renderKgQuestionItem, adaptEventForCard,
     renderArticleAsNewsCard, renderEntityByline, renderFeedCard,
     renderLeaderboardRow

   Internal (not exported):
     renderLoadingState  — @private, no current consumers

   All functions are top-level declarations: adding `export` before any of
   them is the only change required during the ES module migration.
   ============================================================ */
window.FDM = window.FDM || {};

// ---- DOM helper ----
function el(h){ const t=document.createElement('template'); t.innerHTML=h.trim(); return t.content.firstChild; }

/**
 * Pure role badge — depends only on user.role.
 * Defined here so renderers never need to call FDM.components.renderRoleBadge.
 * ui.js re-exposes this via FDM.components.renderRoleBadge for backward compat with controllers.
 */
function renderRoleBadge(user){
  if(!user || !user.role || user.role === 'guest') return '';
  const labels = { member:'Member', expert:'Expert', moderator:'Moderator', admin:'Admin' };
  return `<span class="role-badge role-badge--${user.role}">${labels[user.role] || user.role}</span>`;
}

function renderAgendaCard(item){
  const [cat,title,author,time,seed] = item;
  const imgSeed = seed || (cat+title.length);
  return el(`
    <div class="agenda-card" data-title="${title.toLowerCase()}">
      <div class="agenda-media"><img loading="lazy" src="assets/images/editorial-0.svg" alt=""></div>
      <div class="cat">${cat}</div>
      <h4>${title}</h4>
      <div class="meta">${author} · ${time} read</div>
    </div>`);
}
function renderNewsCard(n){
  return el(`
    <div class="news-card ${n.lead?'lead':''}" data-title="${n.title.toLowerCase()}">
      <div class="news-media"><img loading="lazy" src="assets/images/editorial-0.svg" alt=""></div>
      <span class="badge-editor">Editorial</span>
      <div class="cat">${n.cat}</div>
      <h4><a href="article.html?id=${encodeURIComponent(n.id||'art-tariff-spreadsheet')}">${n.title}</a></h4>
      <div class="meta"><span>${n.author}</span><span class="dot"></span><span>${n.time} read</span><span class="dot"></span><span>${n.date}</span></div>
    </div>`);
}
function renderPick(item){
  const [k,title,seed] = item;
  return el(`
    <div class="pick">
      <img loading="lazy" src="assets/images/avatar.svg" alt="">
      <div><div class="n">${k}</div><h5>${title}</h5></div>
    </div>`);
}
function renderDiscussionRow(item, author, followHtml){
  if(Array.isArray(item)){
    // Legacy shape used by index.html/news.html — output unchanged.
    const [cat,title,votes,replies,avs] = item;
    return el(`
      <div class="disc-row">
        <div class="vote"><span class="n">${votes}</span><span class="l">Votes</span></div>
        <div class="disc-main">
          <div class="cat">${cat}</div>
          <h4>${title}</h4>
          <div class="meta">
            <div class="avatars">${avs.map(a=>`<img loading="lazy" src="assets/images/avatar.svg" alt="">`).join('')}</div>
            <span>${avs.length} contributors</span><span class="dot"></span><span>Active now</span>
          </div>
        </div>
        <div class="disc-right"><span class="replies">${replies}</span>replies</div>
      </div>`);
  }
  // Full Discussion model — richer status badges, real author + timestamps,
  // plus data attributes the interaction service sorts/filters by.
  const badges = [
    item.isPinned && '<span class="tag">Pinned</span>',
    item.acceptedAnswerId && '<span class="tag" style="color:var(--mkt-pos); border-color:var(--mkt-pos);">Solved</span>',
    item.moderationStatus === 'locked' && '<span class="tag">Locked</span>',
  ].filter(Boolean).join(' ');
  const roleBadge = renderRoleBadge(author);
  const followBtn = followHtml || '';
  return el(`
    <div class="disc-row" data-title="${item.title.toLowerCase()}" data-category="${item.category}"
         data-votes="${item.voteCount}" data-replies="${item.replyCount}"
         data-updated="${new Date(item.updatedAt).getTime()}" data-created="${new Date(item.createdAt).getTime()}">
      <div class="vote"><span class="n">${item.voteCount}</span><span class="l">Votes</span></div>
      <div class="disc-main">
        <div class="cat">${item.category} ${badges}</div>
        <h4><a href="thread.html?id=${encodeURIComponent(item.id)}">${item.title}</a></h4>
        <div class="meta">
          <img class="avatar" style="width:24px;height:24px;" src="${author?author.avatarUrl:''}" alt="">
          <span>${author?author.nickname:'Member'}</span> ${roleBadge}
          <span class="dot"></span><span>Updated ${FDM.utils.formatRelativeTime(item.updatedAt)}</span>
          ${followBtn ? '<span class="dot"></span>' + followBtn : ''}
        </div>
      </div>
      <div class="disc-right"><span class="replies">${item.replyCount}</span>replies</div>
    </div>`);
}
function renderQuestionCard(q){
  return el(`
    <div class="q-card" data-title="${(q.q||'').toLowerCase()}" data-category="${q.category||''}" data-difficulty="${q.difficulty||''}"
         data-expert="${q.expert||''}" data-votes="${q.voteCount||0}" data-answers="${q.answerCount||0}"
         data-created="${q.createdAt ? new Date(q.createdAt).getTime() : 0}">
      <div class="tags">${q.tags.map(t=>`<span class="q-tag">${t}</span>`).join('')}</div>
      <h4><a href="question.html?id=${encodeURIComponent(q.id||'q-jacquard')}">${q.q}</a></h4>
      <div class="answer-row">
        <img loading="lazy" src="assets/images/avatar.svg" alt="">
        <div class="answer-meta">
          <div class="name">${q.expert} <span class="verified"></span></div>
          <div class="role">${q.role}</div>
        </div>
        ${q.accepted ? '<div class="accepted">✓ Best Answer</div>' : ''}
      </div>
    </div>`);
}
/** Standard compact event card — unchanged, used by hompage/article/thread sidebars. */
function renderEventCard(item){
  const [day,mon,type,title] = item;
  return el(`
    <div class="event-card">
      <div class="event-date"><span class="day">${day}</span><span class="mon">${mon}</span></div>
      <div class="event-body">
        <div class="type">${type}</div>
        <h4>${title}</h4>
        <div class="loc">Follow for updates →</div>
      </div>
    </div>`);
}
/** Full event card for events.html — consumes the richer event object shape. */
function renderEventCardFull(ev){
  return el(`
    <div class="event-card-full ${ev.past?'is-past':''}" data-type="${ev.type.toLowerCase()}" data-title="${ev.title.toLowerCase()}" data-day="${ev.day}">
      <div class="event-date"><span class="day">${ev.day}</span><span class="mon">${ev.month}</span></div>
      <div class="event-body-full">
        <div class="event-type-row"><span class="type">${ev.type}</span>${ev.past?'<span class="tag" style="font-size:9px;margin-left:8px;">Past</span>':''}</div>
        <h4 class="event-title">${ev.title}</h4>
        ${ev.location ? `<div class="event-location">📍 ${ev.location}</div>` : ''}
        ${ev.description ? `<p class="event-desc">${ev.description}</p>` : ''}
        <div class="event-footer">
          ${ev.registration && ev.registration !== '#'
            ? `<a href="${ev.registration}" class="btn-line" target="_blank" rel="noopener">Register →</a>`
            : `<span class="event-cta-placeholder">Details coming soon</span>`}
        </div>
      </div>
    </div>`);
}

/* ---- NEW shared components ---- */

/** Compact author byline card — used on article bylines and expert mentions. */
function renderAuthorCard(user){
  if(!user) return el('<div class="author-card"></div>');
  const badge = renderRoleBadge(user);
  return el(`
    <div class="author-card">
      <img class="avatar" src="${user.avatarUrl||''}" alt="">
      <div class="author-card-body">
        <div class="author-card-name">${user.nickname} ${badge}</div>
        <div class="author-card-role">${user.professionalRole||''}</div>
      </div>
    </div>`);
}

/** Generic member/user card — community directory, follower lists, expert grids. */
function renderUserCard(user){
  const badge = renderRoleBadge(user);
  const expertise = (user.expertise || []).join(', ');
  return el(`
    <div class="user-card" data-title="${(user.nickname||'').toLowerCase()}" data-expertise="${expertise.toLowerCase()}">
      <img class="avatar" src="${user.avatarUrl||''}" alt="">
      <h5>${user.nickname}</h5>
      <div class="user-card-role">${user.professionalRole||''}</div>
      ${badge ? `<div class="user-card-badge">${badge}</div>` : ''}
      <div class="user-card-stats"><span>${(user.reputation||0).toLocaleString()} rep</span><span class="dot"></span><span>${user.followersCount||0} followers</span></div>
      <div class="user-card-expertise" style="font-size:11.5px;color:var(--stone);margin-top:6px;">${expertise}</div>
    </div>`);
}

/**
 * Renders one comment/reply node, including nested children.
 * @param {Object} comment - FDM.models.createComment() shape
 * @param {Object} author - resolved user for comment.authorId
 * @param {Array} [children] - already-resolved child comments, each {comment, author, children}
 * @param {string} [voteHtml] - pre-rendered vote control HTML (injected by comment.component.js)
 */
function renderCommentItem(comment, author, children, voteHtml){
  const time = (FDM.utils && FDM.utils.formatRelativeTime) ? FDM.utils.formatRelativeTime(comment.createdAt) : comment.createdAt;
  const roleBadge = renderRoleBadge(author);
  const vote = voteHtml || '';
  const attachments = (comment.attachments && comment.attachments.length)
    ? `<div class="comment-attachments">${comment.attachments.map(a => `<a href="${a.url}" class="tag">📎 ${a.name}</a>`).join('')}</div>` : '';
  const node = el(`
    <div class="comment-item ${comment.isPinned?'is-pinned':''} ${comment.isHidden?'is-hidden':''}" data-comment-id="${comment.id}">
      <div class="comment-vote-col">${vote}</div>
      <div class="comment-body-col">
        <div class="comment-meta">
          <img class="avatar" src="${author?author.avatarUrl:''}" alt="">
          <span class="comment-author">${author?author.nickname:'Deleted user'}</span>
          ${roleBadge}
          <span class="dot"></span><span class="comment-time">${time}</span>
          ${comment.editedAt ? '<span class="comment-edited">· edited</span>' : ''}
          ${comment.isAcceptedAnswer ? '<span class="accepted">✓ Accepted</span>' : ''}
        </div>
        <div class="comment-text ${comment.isCollapsed?'is-collapsed':''}">${FDM.safeText(comment.body)}</div>
        ${comment.isCollapsed ? '<button class="comment-action comment-expand">Show more</button>' : ''}
        ${attachments}
        <div class="comment-actions">
          <button class="comment-action">Reply</button>
          <button class="comment-action">Quote</button>
          <button class="comment-action">Report</button>
          <span class="comment-report-status"></span>
        </div>
        <div class="comment-children"></div>
      </div>
    </div>`);
  const expandBtn = node.querySelector('.comment-expand');
  if(expandBtn){
    expandBtn.addEventListener('click', () => {
      node.querySelector('.comment-text').classList.remove('is-collapsed');
      expandBtn.remove();
    });
  }
  if(children && children.length){
    const childWrap = node.querySelector('.comment-children');
    children.forEach(c => childWrap.appendChild(renderCommentItem(c.comment, c.author, c.children)));
  }
  return node;
}

/** Company directory card — links to future company.html?id=... */
function renderCompanyCard(company){
  const safe=FDM.safeText;
  return el(`<a href="company.html?id=${encodeURIComponent(company.id)}" class="company-card" data-title="${safe(company.name.toLowerCase())}" data-city="${safe(company.city.toLowerCase())}" data-specialization="${safe(company.specialization.toLowerCase())}">
    <div class="company-card-logo"><span class="company-initial" aria-hidden="true">${safe(company.name.split(/\s+/).slice(0,2).map(x=>x[0]).join(''))}</span></div>
    <div class="company-card-body"><span class="eyebrow">${safe(company.specialization)}</span><h2 class="company-card-name">${safe(company.name)}</h2><p class="company-card-location">${safe(company.city||'Comune non indicato nella fonte consultata')}</p><p class="company-card-desc">${safe(company.description)}</p><span class="company-source">Fonti ufficiali consultate: ${safe(company.checkedAt)}</span></div></a>`);
}
/** @future company.html — "Verify on ReportAziende" CTA using VAT number. No iframe/scraping. */
function renderVerifyCompanyLink(company){
  return el('<span class="demo-data-label">DEMO: nessuna visura o certificazione reale associata.</span>');
}

/** @future notifications.html — single notification list item. */
function renderNotificationItem(n){
  const time = (FDM.utils && FDM.utils.formatRelativeTime) ? FDM.utils.formatRelativeTime(n.createdAt) : n.createdAt;
  return el(`
    <a href="${n.link}" class="notification-item ${n.isRead?'':'is-unread'}">
      <span class="notification-dot"></span>
      <div class="notification-body">
        <span class="notification-message">${n.message}</span>
        <span class="notification-time">${time}</span>
      </div>
    </a>`);
}

/** Generic empty state, used by any list that currently has zero items. */
function renderEmptyState(message, hint){
  return el(`
    <div class="state-block state-empty">
      <div class="state-title">${message || 'Nothing here yet'}</div>
      ${hint ? `<div class="state-hint">${hint}</div>` : ''}
    </div>`);
}
/** @future async data loading — generic loading skeleton state. */
function renderLoadingState(){
  return el(`<div class="state-block state-loading"><span class="state-spinner"></span> Loading…</div>`);
}
/** Generic error state, with optional retry callback wired by the caller. */
function renderErrorState(message){
  return el(`
    <div class="state-block state-error">
      <div class="state-title">${message || 'Something went wrong.'}</div>
      <button class="btn btn-line state-retry">Retry</button>
    </div>`);
}

/** Generic stat strip — used by article/discussion/event headers. @param {Array} stats - [{value,label}] */
function renderStatStrip(stats){
  const fmt = (n) => (FDM.utils && FDM.utils.formatCompactNumber) ? FDM.utils.formatCompactNumber(n) : n;
  return el(`
    <div class="stat-strip">
      ${stats.map(s => `<div class="stat-item"><b>${typeof s.value==='number'?fmt(s.value):s.value}</b><span>${s.label}</span></div>`).join('')}
    </div>`);
}

/**
 * Mounts a Knowledge Graph panel: optional title + either rendered
 * items or an empty state. Used for every "Related X" panel so the
 * empty-state fallback logic exists exactly once. Pass an empty
 * string/falsy `title` to omit the heading (e.g. when the surrounding
 * sidebar block already renders its own title).
 * @param {string} targetId
 * @param {string} title
 * @param {Array} items
 * @param {function} itemRenderer - (item) => Node
 * @param {string} emptyMessage
 */
function mountKgPanel(targetId, title, items, itemRenderer, emptyMessage){
  const target = document.getElementById(targetId);
  if(!target) return;
  if(title) target.appendChild(el(`<div class="kg-panel-title">${title}</div>`));
  if(!items || !items.length){
    target.appendChild(renderEmptyState(emptyMessage || 'Nothing connected here yet.'));
    return;
  }
  const list = el(`<div class="kg-panel-list"></div>`);
  items.forEach(item => list.appendChild(itemRenderer(item)));
  target.appendChild(list);
}

/** Adapts a Question model + resolved expert into the shape renderQuestionCard expects. */
function adaptQuestionForCard(question, expert){
  return renderQuestionCard({
    id: question.id, tags: question.tags, q: question.title, category: question.category, difficulty: question.difficulty,
    voteCount: question.voteCount, answerCount: question.answerCount, createdAt: question.createdAt,
    expert: expert ? expert.nickname : 'Community', role: expert ? expert.professionalRole : '',
    seed: question.expertId || question.id, accepted: question.accepted,
  });
}
function renderKgDiscussionItem(discussion){
  return el(`
    <a href="thread.html?id=${encodeURIComponent(discussion.id)}" class="kg-item-discussion">${discussion.title}
      <span class="kg-meta">${discussion.replyCount} replies · ${discussion.voteCount} votes</span>
    </a>`);
}
/** Renders one row in a "Related Questions" knowledge-graph panel. */
function renderKgQuestionItem(question){
  return el(`<a href="question.html?id=${encodeURIComponent(question.id)}" class="kg-item-discussion">${question.title}</a>`);
}
/** Adapts an Event model into the tuple shape renderEventCard expects. */
function adaptEventForCard(event){
  return [event.day, event.month, event.type, event.title];
}
/** Adapts an Article model into the shape renderNewsCard expects, resolving the byline against staff. */
function renderArticleAsNewsCard(article){
  const author = (FDM.data.staff || []).find(s => s.id === article.authorId);
  return renderNewsCard({
    id: article.id, cat: article.category,
    title: article.title,
    author: author ? author.nickname : 'PratoHub Magazine',
    time: article.readingTime,
    date: FDM.utils.formatDate(article.publishedAt),
    seed: article.imageSeed || article.id,
  });
}
/**
 * Shared entity byline row (author + meta chips).
 * Used by thread.js, question.js and any future detail page.
 * @param {Object|null} author
 * @param {string[]} metaChips
 */
function renderEntityByline(author, metaChips){
  const badge = renderRoleBadge(author);
  const chips = metaChips.filter(Boolean).map((c,i) => (i ? '<span class="dot"></span>' : '') + `<span>${c}</span>`).join('');
  return `${author ? `<img class="avatar" style="width:28px;height:28px;" src="${author.avatarUrl||''}" alt=""><span>${author.nickname||''}</span>${badge ? ' '+badge : ''}<span class="dot"></span>` : ''}${chips}`;
}
/**
 * Thin wrapper that gives any card a sortable/filterable envelope for unified feeds.
 * @param {'article'|'discussion'|'question'|'event'} type
 * @param {Element} cardNode - output of any existing renderer
 * @param {string} dateIso   - ISO 8601 for sort; for events use a synthetic value
 * @param {string} [title]   - plain-text title for search
 * @returns {Element} wrapper div with data-type, data-date, data-title attributes
 */
function renderFeedCard(type, cardNode, dateIso, title){
  const TYPE_LABELS = { article:'Article', discussion:'Discussion', question:'Question', event:'Event' };
  const wrapper = document.createElement('div');
  wrapper.className = 'feed-card';
  wrapper.dataset.type  = type;
  wrapper.dataset.date  = new Date(dateIso || 0).getTime();
  wrapper.dataset.title = (title || '').toLowerCase();
  const label = document.createElement('span');
  label.className = `feed-type-badge feed-type-${type}`;
  label.textContent = TYPE_LABELS[type] || type;
  wrapper.appendChild(label);
  wrapper.appendChild(cardNode);
  return wrapper;
}
/** @future also demo.html, admin dashboard. */
function renderLeaderboardRow(user, rank){
  const badge = renderRoleBadge(user);
  const rep = (FDM.utils && FDM.utils.formatCompactNumber) ? FDM.utils.formatCompactNumber(user.reputation||0) : String(user.reputation||0);
  return el(`
    <div class="leaderboard-row">
      <div class="lb-rank ${rank <= 3 ? 'top3' : ''}">${rank}</div>
      <div class="lb-info">
        <img class="avatar" src="${user.avatarUrl||''}" alt="">
        <div>
          <div class="lb-name">${user.nickname||''} ${badge}</div>
          <div class="lb-role">${user.professionalRole||''}</div>
        </div>
      </div>
      <div class="lb-rep"><b>${rep}</b><span>Reputation</span></div>
    </div>`);
}
