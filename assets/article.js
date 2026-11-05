(function(){
"use strict";
/* ============================================================
   ARTICLE.JS — page-specific composition for article.html only.
   Pure orchestration: every render, lookup, permission check and
   lazy-load strategy is delegated to the matching FDM service,
   component or renderer. This file only decides WHAT to mount
   WHERE — never HOW.
   ============================================================ */

const article = FDM.knowledgeGraph.findArticle(new URLSearchParams(location.search).get('id') || 'art-tariff-spreadsheet');

if(!article){
  document.getElementById('articleHero').innerHTML = '';
  document.getElementById('articleHero').appendChild(
    renderErrorState('This article could not be found.')
  );
} else {
  renderArticlePage(article);
}

function renderArticlePage(article){
  const author = (FDM.data.staff || []).find(u => u.id === article.authorId);
  const editor = (FDM.data.staff || []).find(u => u.id === article.editorId);

  // ---- Hero ----
  FDM.navigation.mountBreadcrumbs('articleBreadcrumbs', [
    { label:'Home', href:'index.html' },
    { label:'News', href:'news.html' },
    { label:article.category, href:'news.html' },
    { label:'Article' },
  ]);
  document.getElementById('articleCategoryEyebrow').textContent = article.category;
  document.getElementById('articleTitle').textContent = article.title;
  document.getElementById('articleSubtitle').textContent = article.subtitle;
  document.getElementById('articleAuthorCard').appendChild(renderAuthorCard(author));
  document.getElementById('articleByline').innerHTML = `
    <span>Edited by ${editor ? editor.nickname : 'the desk'}</span><span class="dot"></span>
    <span>${article.readingTime} min read</span><span class="dot"></span>
    <span>Published ${FDM.utils.formatRelativeTime(article.publishedAt)}</span><span class="dot"></span>
    <span>Updated ${FDM.utils.formatRelativeTime(article.updatedAt)}</span>`;
  document.getElementById('articleStats').appendChild(renderStatStrip([
    { value:article.viewCount, label:'Views' },
    { value:article.commentCount, label:'Comments' },
    { value:article.saveCount, label:'Saves' },
    { value:article.shareCount, label:'Shares' },
  ]));

  const coverFigure = document.querySelector('.article-cover');
  if(article.heroImageUrl){
    document.getElementById('articleCoverImg').src = article.heroImageUrl;
    document.getElementById('articleCoverImg').alt = article.title;
    document.getElementById('articleCoverCaption').textContent = article.coverCaption;
  } else if(coverFigure){
    coverFigure.style.display = 'none';
  }

  // ---- Table of Contents + reading progress ----
  FDM.tocComponent.mount('articleToc', article.sections, 'articleBodyContent', 'readingProgress');

  // ---- Citations ----
  const citationsBlock = document.querySelector('.article-citations');
  if(article.citations && article.citations.length){
    document.getElementById('articleCitations').innerHTML = article.citations
      .map(c => `<li><a href="${c.url}">${c.label}</a></li>`).join('');
  } else if(citationsBlock){
    citationsBlock.style.display = 'none';
  }

  // ---- Gallery (lazy-mounted by the component itself) ----
  FDM.galleryComponent.mount('gallerySection', article.galleryImages);

  // ---- Poll ----
  const poll = FDM.knowledgeGraph.findPoll(article.pollId);
  if(poll) FDM.pollComponent.mount('pollSection', poll);

  // ---- Share / bookmark ----
  FDM.shareComponent.mount('articleShare', {
    targetType:'article', targetId:article.id, title:article.title, url:window.location.href,
  });

  // ---- Sidebar + main-content Knowledge Graph panels ----
  const related = FDM.knowledgeGraph.getRelatedForArticle(article);

  mountKgPanel('kgMarket', '', related.market, fullCard, 'No market indicators linked to this story.');
  mountKgPanel('kgExperts', '', related.experts, renderUserCard, 'No experts linked to this story yet.');
  mountKgPanel('kgEvents', '', related.events, (e) => renderEventCard(adaptEventForCard(e)), 'No upcoming events tied to this story.');
  mountKgPanel('kgDiscussions', '', related.discussions, renderKgDiscussionItem, 'No linked discussions yet — be the first to start one.');
  mountKgPanel('kgQuestions', '', related.questions, renderKgQuestionItem, 'No open questions reference this article yet.');

  // ---- Update history ----
  if(article.revisionHistory && article.revisionHistory.length){
    document.getElementById('articleTimeline').appendChild(renderTimeline(article.revisionHistory));
  } else {
    document.getElementById('articleTimeline').appendChild(renderEmptyState('No revisions recorded.'));
  }

  // ---- Comments (lazy-mounted by the comment service) ----
  const commentCount = FDM.commentService.getCommentsFor('article', article.id).length;
  document.getElementById('commentsHeading').textContent = `Comments (${commentCount})`;
  FDM.commentService.mountThreadFor('articleComments', 'article', article.id, {
    composerPlaceholder:'Add to the discussion… (Markdown supported)',
  });

  // ---- Recommendations ----
  if(related.articles.length){
    document.getElementById('recommendationsGrid').append(...related.articles.map(renderArticleAsNewsCard));
  } else {
    document.getElementById('recommendationsGrid').appendChild(
      renderEmptyState('No related stories yet.', 'Check back after the next issue.')
    );
  }
}

})();
