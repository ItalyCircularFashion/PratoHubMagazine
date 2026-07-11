/* ============================================================
import { getCommentsFor, resolveAuthor, mountThreadFor } from '../services/comment.service.js';
import { renderRoleBadge, renderAuthNav, mountAuthNav, isVisibleFor, applyPermissionVisibility, gateOrCta, renderCommentComposer, renderVoteControl, mountRoleSwitcher } from '../components/ui.js';
import { findArticle, findDiscussion, findQuestion, findEvent, findPoll, findCompany, findUser, getRelatedForCompany, getRelatedForArticle as getRelatedForArticle_kg, getRelatedForDiscussion, getRelatedForQuestion, findExpert, findCommodity } from '../services/knowledge-graph.service.js';
import { mountBreadcrumbs, navigateTo, navigateBack } from '../services/navigation.service.js';
import { mount as mountShare } from '../components/share.component.js';
import { formatRelativeTime, formatDate, formatCompactNumber } from '../utils/format.js';
   QUESTION.JS — page-specific composition for question.html.
   Mirrors thread.js. Pure orchestration only.
   ============================================================ */

const question = findQuestion('q-jacquard');

if(!question){
  document.getElementById('qHero').appendChild(renderErrorState('This question could not be found.'));
} else {
  renderQuestionPage(question);
}

function renderQuestionPage(question){
  const expert = findUser(question.expertId);
  const difficultyLabel = { beginner:'Beginner', intermediate:'Intermediate', advanced:'Advanced' };

  // ---- Breadcrumbs ----
  mountBreadcrumbs('qBreadcrumbs', [
    { label:'Home', href:'index.html' },
    { label:'Questions', href:'questions.html' },
    { label:question.category, href:'questions.html' },
    { label:'Question' },
  ]);

  // ---- Badges: category, difficulty, status ----
  document.getElementById('qBadges').innerHTML = `
    <span class="eyebrow" style="display:inline-flex;">${question.category}</span>
    <span class="tag">${difficultyLabel[question.difficulty] || question.difficulty}</span>
    ${question.accepted ? '<span class="tag" style="color:var(--mkt-pos);border-color:var(--mkt-pos);">Answered</span>' : '<span class="tag">Open</span>'}
    ${question.tags.map(t => `<span class="q-tag">${t}</span>`).join('')}`;

  // ---- Title ----
  document.getElementById('qTitle').textContent = question.title;

  // ---- Byline ----
  document.getElementById('qByline').innerHTML = `
    ${expert ? `<img class="avatar" style="width:28px;height:28px;" src="${expert.avatarUrl}" alt="">
    <span>${expert.nickname}</span>
    ${renderRoleBadge(expert)}
    <span class="dot"></span>` : ''}
    <span>Asked ${formatRelativeTime(question.createdAt)}</span>
    <span class="dot"></span><span>Updated ${formatRelativeTime(question.updatedAt)}</span>`;

  // ---- Stats ----
  document.getElementById('qStats').appendChild(renderStatStrip([
    { value:question.viewCount, label:'Views' },
    { value:question.voteCount, label:'Votes' },
    { value:question.answerCount, label:'Answers' },
    { value:question.followerIds.length, label:'Followers' },
  ]));

  // ---- Vote + share ----
  function renderQVote(){
    document.getElementById('qVote').innerHTML = renderVoteControl(question.voteCount, 'question', question.id);
  }
  renderQVote();
  document.addEventListener('fdm:authchange', renderQVote);

  mountShare('qShare', {
    targetType:'question', targetId:question.id, title:question.title, url:window.location.href,
  });

  // ---- Answers: accepted first, then remaining in chronological order ----
  const allAnswers = getCommentsFor('question', question.id);
  const accepted  = allAnswers.find(c => c.id === question.acceptedAnswerId) || null;
  const rest      = allAnswers.filter(c => c.id !== question.acceptedAnswerId);

  // Accepted answer rendered as a standalone highlighted block, then remaining via the thread component.
  if(accepted){
    const acceptedAuthor = findUser(accepted.authorId);
    const node = renderCommentItem(accepted, acceptedAuthor, []);
    node.classList.add('is-pinned');
    const label = document.createElement('div');
    label.className = 'kg-panel-title';
    label.style.marginBottom = '12px';
    label.textContent = 'Accepted Answer';
    document.getElementById('qAcceptedAnswer').appendChild(label);
    document.getElementById('qAcceptedAnswer').appendChild(node);
  }

  mountThreadFor('qAnswers', 'question', question.id, {
    composerPlaceholder:'Post an answer… (Markdown supported)',
    emptyMessage:'No additional answers yet.',
    excludeId: question.acceptedAnswerId,
  });

  // ---- Sidebar: knowledge graph ----
  const related = getRelatedForQuestion(question);

  mountKgPanel('qExpert', '', expert ? [expert] : [], renderUserCard, 'No expert linked to this question.');
  mountKgPanel('qRelatedQuestions', '', related.questions, renderKgQuestionItem, 'No similar questions yet.');
  mountKgPanel('qRelatedDiscussions', '', related.discussions, renderKgDiscussionItem, 'No related discussions yet.');
  mountKgPanel('qRelatedArticles', '', related.articles, renderArticleAsNewsCard, 'No related articles yet.');
}