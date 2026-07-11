/* ============================================================
   CARD RENDERERS
   assets/renderers/card.renderer.js

   Public API:
     el, renderRoleBadge, renderAgendaCard, renderNewsCard, renderPick,
     renderDiscussionRow, renderQuestionCard, renderEventCard, renderEventCardFull,
     renderAuthorCard, renderUserCard, renderCommentItem, renderCompanyCard,
     renderVerifyCompanyLink, renderNotificationItem, renderEmptyState,
     renderErrorState, renderStatStrip, mountKgPanel, adaptQuestionForCard,
     renderKgDiscussionItem, renderKgQuestionItem, adaptEventForCard,
     renderArticleAsNewsCard, renderEntityByline, renderFeedCard,
     renderLeaderboardRow
   ============================================================ */

import { formatRelativeTime, formatDate, formatCompactNumber } from '../utils/format.js';
import { staff } from '../data/articles.data.js';

// Stable Unsplash textile-industry image pool used by card renderers
const UNSPLASH_TEXTILE = [
  'photo-1660980041852-230420b8f99f',
  'photo-1758272024360-a95be2abe403',
  'photo-1758269736002-71d2e00f6ba3',
  'photo-1528458909336-e7a0adfed0a5',
  'photo-1583339824000-5afecfd41835',
  'photo-1606259458027-54d2a728b6ab',
  'photo-1611007725135-21ca8d0d5357',
  'photo-1524404794194-16bae22718c0',
];
const UNSPLASH_PROFESSIONAL = [
  'photo-1472099645785-5658abf4ff4e',
  'photo-1494790108377-be9c29b29330',
  'photo-1507003211169-0a1dd7228f2d',
  'photo-1438761680603-b69e5e7c3c2a',
  'photo-1500648767791-00dcc994a43e',
  'photo-1544005313-94ddf0286df2',
];
function unsplashUrl(seed, w, q=80){
  const list = String(seed).length % 2 === 0 ? UNSPLASH_TEXTILE : UNSPLASH_PROFESSIONAL;
  const id = list[Math.abs(hashCode(seed)) % list.length];
  return `https://images.unsplash.com/${id}?w=${w}&q=${q}&fit=crop&auto=format`;
}
function hashCode(s){ let h=0; for(let i=0;i<s.length;i++) h=((h<<5)-h)+s.charCodeAt(i); return h; }

// ---- DOM helper ----
export function el(h){ const t=document.createElement('template'); t.innerHTML=h.trim(); return t.content.firstChild; }

/** Pure role badge — depends only on user.role. */
export function renderRoleBadge(user){
  if(!user || !user.role || user.role === 'guest') return '';
  const labels = { member:'Member', expert:'Expert', moderator:'Moderator', admin:'Admin' };
  return `<span class="role-badge role-badge--${user.role}">${labels[user.role] || user.role}</span>`;
}

export function renderAgendaCard(item){
  const [cat,title,author,time,seed] = item;
  const imgSeed = seed || (cat+title.length);
  return el(`
    <div class="agenda-card" data-title="${title.toLowerCase()}">
      <div class="agenda-media"><img loading="lazy" src="${unsplashUrl(imgSeed,420)}" alt=""></div>
      <div class="cat">${cat}</div>
      <h4>${title}</h4>
      <div class="meta">${author} · ${time} read</div>
    </div>`);
}
export function renderNewsCard(n){
  return el(`
    <div class="news-card ${n.lead?'lead':''}" data-title="${n.title.toLowerCase()}">
      <div class="news-media"><img loading="lazy" src="${unsplashUrl(n.seed,n.lead?700:500)}" alt=""></div>
      <span class="badge-editor">Editorial</span>
      <div class="cat">${n.cat}</div>
      <h4>${n.title}</h4>
      <div class="meta"><span>${n.author}</span><span class="dot"></span><span>${n.time} read</span><span class="dot"></span><span>${n.date}</span></div>
    </div>`);
}
export function renderPick(item){
  const [k,title,seed] = item;
  return el(`
    <div class="pick">
      <img loading="lazy" src="${unsplashUrl(seed,120)}" alt="">
      <div><div class="n">${k}</div><h5>${title}</h5></div>
    </div>`);
}
export function renderDiscussionRow(item, author, followHtml){
  if(Array.isArray(item)){
    const [cat,title,votes,replies,avs] = item;
    return el(`
      <div class="disc-row">
        <div class="vote"><span class="n">${votes}</span><span class="l">Votes</span></div>
        <div class="disc-main">
          <div class="cat">${cat}</div>
          <h4>${title}</h4>
          <div class="meta">
            ${avs.map(a=>`<img loading="lazy" src="${unsplashUrl(a,60)}" alt="">`).join('')}
            <span>${avs.length} contributors</span><span class="dot"></span><span>Active now</span>
          </div>
        </div>
        <div class="disc-right"><span class="replies">${replies}</span>replies</div>
      </div>`);
  }
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
        <h4><a href="thread.html">${item.title}</a></h4>
        <div class="meta">
          <img class="avatar" style="width:24px;height:24px;" src="${author?author.avatarUrl:''}" alt="">
          <span>${author?author.nickname:'Member'}</span> ${roleBadge}
          <span class="dot"></span><span>Updated ${formatRelativeTime(item.updatedAt)}</span>
          ${followBtn ? '<span class="dot"></span>' + followBtn : ''}
        </div>
      </div>
      <div class="disc-right"><span class="replies">${item.replyCount}</span>replies</div>
    </div>`);
}
export function renderQuestionCard(q){
  return el(`
    <div class="q-card" data-title="${(q.q||'').toLowerCase()}" data-category="${q.category||''}" data-difficulty="${q.difficulty||''}"
         data-expert="${q.expert||''}" data-votes="${q.voteCount||0}" data-answers="${q.answerCount||0}"
         data-created="${q.createdAt ? new Date(q.createdAt).getTime() : 0}">
      <div class="tags">${q.tags.map(t=>`<span class="q-tag">${t}</span>`).join('')}</div>
      <h4>${q.q}</h4>
      <div class="answer-row">
        <img loading="lazy" src="${unsplashUrl(q.seed,64)}" alt="">
        <div class="answer-meta">
          <div class="name">${q.expert} <span class="verified"></span></div>
          <div class="role">${q.role}</div>
        </div>
        ${q.accepted ? '<div class="accepted">✓ Best Answer</div>' : ''}
      </div>
    </div>`);
}
/** Standard compact event card — unchanged. */
export function renderEventCard(item){
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
/** Full event card for events.html. */
export function renderEventCardFull(ev){
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

/** Compact author byline card. */
export function renderAuthorCard(user){
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

/** Generic member/user card. */
export function renderUserCard(user){
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
 * Renders one comment/reply node.
 */
export function renderCommentItem(comment, author, children, voteHtml){
  const time = formatRelativeTime(comment.createdAt);
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
        <div class="comment-text ${comment.isCollapsed?'is-collapsed':''}">${comment.body}</div>
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

/** Company directory card. */
export function renderCompanyCard(company){
  const certs = (company.certifications || []).slice(0,3).map(c=>`<span class="tag">${c}</span>`).join('');
  return el(`
    <a href="company.html?id=${company.id}" class="company-card"
       data-title="${company.name.toLowerCase()}"
       data-city="${(company.city||'').toLowerCase()}"
       data-specialization="${(company.specialization||'').toLowerCase()}"
       data-certifications="${(company.certifications||[]).join(' ').toLowerCase()}"
       data-technologies="${(company.technologies||[]).join(' ').toLowerCase()}"
       data-sectors="${(company.productSectors||[]).join(' ').toLowerCase()}">
      <div class="company-card-logo">
        <img loading="lazy" src="${company.logoUrl}" alt="${company.name}">
      </div>
      <div class="company-card-body">
        <div class="eyebrow" style="display:inline-flex; margin-bottom:8px; font-size:10px;">${company.specialization}</div>
        <h4 class="company-card-name">${company.name}</h4>
        <div class="company-card-location">&#x1F4CD; ${company.city}${company.district && company.district !== company.city ? ', ' + company.district : ''}</div>
        <p class="company-card-desc">${company.description}</p>
        <div class="company-card-meta">
          ${company.foundedYear ? `<span>Est. ${company.foundedYear}</span><span class="dot"></span>` : ''}
          <span>${company.employeeRange ? company.employeeRange + ' emp.' : ''}</span>
        </div>
        <div class="company-card-certs">${certs}</div>
      </div>
    </a>`);
}

/** @future company.html — "Verify on ReportAziende" CTA. */
export function renderVerifyCompanyLink(company){
  const query = encodeURIComponent(company.vatNumber || company.name);
  return el(`<a href="https://www.reportaziende.it/ricerca?q=${query}" target="_blank" rel="noopener noreferrer" class="btn-line">Verify on ReportAziende &#x2197;</a>`);
}

/** @future notifications.html — single notification list item. */
export function renderNotificationItem(n){
  const time = formatRelativeTime(n.createdAt);
  return el(`
    <a href="${n.link}" class="notification-item ${n.isRead?'':'is-unread'}">
      <span class="notification-dot"></span>
      <div class="notification-body">
        <span class="notification-message">${n.message}</span>
        <span class="notification-time">${time}</span>
      </div>
    </a>`);
}

/** Generic empty state. */
export function renderEmptyState(message, hint){
  return el(`
    <div class="state-block state-empty">
      <div class="state-title">${message || 'Nothing here yet'}</div>
      ${hint ? `<div class="state-hint">${hint}</div>` : ''}
    </div>`);
}

/** Generic error state. */
export function renderErrorState(message){
  return el(`
    <div class="state-block state-error">
      <div class="state-title">${message || 'Something went wrong.'}</div>
      <button class="btn btn-line state-retry">Retry</button>
    </div>`);
}

/** Generic stat strip. */
export function renderStatStrip(stats){
  const fmt = formatCompactNumber;
  return el(`
    <div class="stat-strip">
      ${stats.map(s => `<div class="stat-item"><b>${typeof s.value==='number'?fmt(s.value):s.value}</b><span>${s.label}</span></div>`).join('')}
    </div>`);
}

/**
 * Mounts a Knowledge Graph panel.
 */
export function mountKgPanel(targetId, title, items, itemRenderer, emptyMessage){
  const target = document.getElementById(targetId);
  if(!target) return;
  if(title) target.appendChild(el(`<div class="kg-panel-title">${title}</div>`));
  if(!items || !items.length){
    target.appendChild(renderEmptyState(emptyMessage || 'Nothing connected here yet.'));
    return;
  }
  const list = el('<div class="kg-panel-list"></div>');
  items.forEach(item => list.appendChild(itemRenderer(item)));
  target.appendChild(list);
}

/** Adapts Question model into renderQuestionCard shape. */
export function adaptQuestionForCard(question, expert){
  return renderQuestionCard({
    tags: question.tags, q: question.title, category: question.category, difficulty: question.difficulty,
    voteCount: question.voteCount, answerCount: question.answerCount, createdAt: question.createdAt,
    expert: expert ? expert.nickname : 'Community', role: expert ? expert.professionalRole : '',
    seed: question.expertId || question.id, accepted: question.accepted,
  });
}
export function renderKgDiscussionItem(discussion){
  return el(`
    <a href="discussions.html" class="kg-item-discussion">${discussion.title}
      <span class="kg-meta">${discussion.replyCount} replies · ${discussion.voteCount} votes</span>
    </a>`);
}
export function renderKgQuestionItem(question){
  return el(`<a href="questions.html" class="kg-item-discussion">${question.title}</a>`);
}

/** Adapts Event model into tuple shape renderEventCard expects. */
export function adaptEventForCard(event){
  return [event.day, event.month, event.type, event.title];
}

/** Adapts Article model into renderNewsCard shape. */
export function renderArticleAsNewsCard(article){
  const author = (staff || []).find(s => s.id === article.authorId);
  return renderNewsCard({
    cat: article.category,
    title: article.title,
    author: author ? author.nickname : 'Forum della Moda',
    time: article.readingTime,
    date: formatDate(article.publishedAt),
    seed: article.imageSeed || article.id,
  });
}

/**
 * Shared entity byline row.
 */
export function renderEntityByline(author, metaChips){
  const badge = renderRoleBadge(author);
  const chips = metaChips.filter(Boolean).map((c,i) => (i ? '<span class="dot"></span>' : '') + `<span>${c}</span>`).join('');
  return `${author ? `<img class="avatar" style="width:28px;height:28px;" src="${author.avatarUrl||''}" alt=""><span>${author.nickname||''}</span>${badge ? ' '+badge : ''}<span class="dot"></span>` : ''}${chips}`;
}

/**
 * Thin wrapper that gives any card a sortable/filterable envelope.
 */
export function renderFeedCard(type, cardNode, dateIso, title){
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

/** @future profile.html, admin dashboard. */
export function renderLeaderboardRow(user, rank){
  const badge = renderRoleBadge(user);
  const rep = formatCompactNumber(user.reputation || 0);
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

