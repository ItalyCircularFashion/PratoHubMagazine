(function(){
"use strict";
/* ============================================================
   QUESTION.JS — page-specific composition for question.html.
   Mirrors thread.js. Pure orchestration only.
   ============================================================ */

const question = FDM.knowledgeGraph.findQuestion(new URLSearchParams(location.search).get('id') || 'q-jacquard');

if(!question){
  document.getElementById('qHero').appendChild(renderErrorState('This question could not be found.'));
} else {
  renderQuestionPage(question);
}

function renderQuestionPage(question){
  const expert = FDM.knowledgeGraph.findUser(question.expertId);
  const difficultyLabel = { beginner:'Beginner', intermediate:'Intermediate', advanced:'Advanced' };

  // ---- Breadcrumbs ----
  FDM.navigation.mountBreadcrumbs('qBreadcrumbs', [
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
    ${FDM.components.renderRoleBadge(expert)}
    <span class="dot"></span>` : ''}
    <span>Asked ${FDM.utils.formatRelativeTime(question.createdAt)}</span>
    <span class="dot"></span><span>Updated ${FDM.utils.formatRelativeTime(question.updatedAt)}</span>`;

  // ---- Stats ----
  document.getElementById('qStats').appendChild(renderStatStrip([
    { value:question.viewCount, label:'Views' },
    { value:question.voteCount, label:'Votes' },
    { value:question.answerCount, label:'Answers' },
    { value:question.followerIds.length, label:'Followers' },
  ]));

  // ---- Vote + share ----
  function renderQVote(){
    document.getElementById('qVote').innerHTML = FDM.components.renderVoteControl(question.voteCount, 'question', question.id);
  }
  renderQVote();
  document.addEventListener('fdm:authchange', renderQVote);

  FDM.shareComponent.mount('qShare', {
    targetType:'question', targetId:question.id, title:question.title, url:window.location.href,
  });

  // ---- Answers: accepted first, then remaining in chronological order ----
  const allAnswers = FDM.commentService.getCommentsFor('question', question.id);
  const accepted  = allAnswers.find(c => c.id === question.acceptedAnswerId) || null;
  const rest      = allAnswers.filter(c => c.id !== question.acceptedAnswerId);

  // Accepted answer rendered as a standalone highlighted block, then remaining via the thread component.
  if(accepted){
    const acceptedAuthor = FDM.knowledgeGraph.findUser(accepted.authorId);
    const node = renderCommentItem(accepted, acceptedAuthor, []);
    node.classList.add('is-pinned');
    const label = document.createElement('div');
    label.className = 'kg-panel-title';
    label.style.marginBottom = '12px';
    label.textContent = 'Accepted Answer';
    document.getElementById('qAcceptedAnswer').appendChild(label);
    document.getElementById('qAcceptedAnswer').appendChild(node);
  }

  FDM.commentService.mountThreadFor('qAnswers', 'question', question.id, {
    composerPlaceholder:'Post an answer… (Markdown supported)',
    emptyMessage:'No additional answers yet.',
    excludeId: question.acceptedAnswerId,
  });

  // ---- Sidebar: knowledge graph ----
  const related = FDM.knowledgeGraph.getRelatedForQuestion(question);

  mountKgPanel('qExpert', '', expert ? [expert] : [], renderUserCard, 'No expert linked to this question.');
  mountKgPanel('qRelatedQuestions', '', related.questions, renderKgQuestionItem, 'No similar questions yet.');
  mountKgPanel('qRelatedDiscussions', '', related.discussions, renderKgDiscussionItem, 'No related discussions yet.');
  mountKgPanel('qRelatedArticles', '', related.articles, renderArticleAsNewsCard, 'No related articles yet.');
}

})();
