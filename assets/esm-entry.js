/* ============================================================
   ESM ENTRY POINT
   assets/esm-entry.js
   ============================================================
   This is the ES module bootstrap for OC-01.
   It preserves current runtime behavior by:
   - importing modules in their current classic-script load order
   - re-exporting public APIs so consumers can switch to imports later
   - keeping existing window.FDM assignments intact for backward compat

   HTML pages will switch to this single module in OC-02.
   ============================================================ */
import "./models/user.model.js";
import "./models/discussion.model.js";
import "./models/article.model.js";
import "./models/comment.model.js";
import "./models/notification.model.js";
import "./models/vote.model.js";
import "./models/category.model.js";
import "./models/question.model.js";
import "./models/poll.model.js";
import "./models/company.model.js";
import "./data/articles.data.js";
import "./data/discussions.data.js";
import "./data/questions.data.js";
import "./data/events.data.js";
import "./data/notifications.data.js";
import "./data/polls.data.js";
import "./data/comments.data.js";
import "./data/companies.data.js";
import "./data/experts.data.js";
import "./permissions/permissions.js";
import "./utils/format.js";
import "./utils/validation.js";
import "./services/auth.js";
import "./services/session.service.js";
import "./services/market.service.js";
import "./services/navigation.service.js";
import "./services/interaction.service.js";
import "./services/knowledge-graph.service.js";
import "./services/comment.service.js";
import "./renderers/card.renderer.js";
import "./renderers/timeline.renderer.js";
import "./components/ui.js";
import "./components/poll.component.js";
import "./components/comment.component.js";
import "./components/toc.component.js";
import "./components/gallery.component.js";
import "./components/share.component.js";
import "./components/moderation.component.js";

/* Models */
export { createUser } from "./models/user.model.js";
export { createDiscussion } from "./models/discussion.model.js";
export { createArticle } from "./models/article.model.js";
export { createComment } from "./models/comment.model.js";
export { createNotification } from "./models/notification.model.js";
export { createVote } from "./models/vote.model.js";
export { createCategory } from "./models/category.model.js";
export { createQuestion } from "./models/question.model.js";
export { createPoll } from "./models/poll.model.js";
export { createCompany } from "./models/company.model.js";

/* Data */
export { articles } from "./data/articles.data.js";
export { discussions } from "./data/discussions.data.js";
export { questions } from "./data/questions.data.js";
export { events } from "./data/events.data.js";
export { notifications } from "./data/notifications.data.js";
export { polls } from "./data/polls.data.js";
export { comments } from "./data/comments.data.js";
export { companies } from "./data/companies.data.js";
export { experts } from "./data/experts.data.js";
export { staff } from "./data/articles.data.js";

/* Permissions */
export { can, isAtLeast, label, ROLES, getCapabilities, UI_VISIBILITY } from "./permissions/permissions.js";

/* Utils */
export {
  formatRelativeTime,
  formatDate,
  formatCompactNumber,
  validateEmail,
  validateNickname,
  validatePassword,
  validateRequired,
} from "./utils/format.js";

/* Services */
export {
  getCurrentUser,
  isAuthenticated,
  login,
  logout,
  setMockUser,
  MOCK_USERS,
} from "./services/auth.js";

export {
  get,
  set,
  toggleBookmark,
  isBookmarked,
  toggleFollow,
  isFollowing,
  toggleInCollection,
  isInCollection,
  castVote,
  getVoteState,
} from "./services/session.service.js";

export {
  commodities,
  genSeries,
  trendClass,
  sparkSvg,
  fullCard,
  compactCard,
  byName,
  mountMarketTickers,
  mountMarketGrid,
} from "./services/market.service.js";

export {
  initHeaderScroll,
  initFolioRail,
  renderBreadcrumbs,
  mountBreadcrumbs,
} from "./services/navigation.service.js";

export {
  initReveal,
  initChipFilters,
  initNewsletterForm,
  initPagination,
  initSearchBars,
  wireSearchFilter,
  wireSortSelect,
  wireChipFilter,
  wireChipCategoryFilter,
  initVoteControls,
} from "./services/interaction.service.js";

export {
  findUser,
  findExpert,
  findArticle,
  findDiscussion,
  findQuestion,
  findEvent,
  findPoll,
  findCompany,
  findCommodity,
  getRelatedForArticle,
  getRelatedForDiscussion,
  getRelatedForQuestion,
  getRelatedForCompany,
} from "./services/knowledge-graph.service.js";

export { getCommentsFor, resolveAuthor, mountThreadFor } from "./services/comment.service.js";

/* Renderers */
export {
  renderAgendaCard,
  renderNewsCard,
  renderArticleCard,
  renderMarketCard,
  renderPersonCard,
  unsplashUrl,
  hashCode,
  el,
} from "./renderers/card.renderer.js";

export { renderTimeline } from "./renderers/timeline.renderer.js";

/* Components */
export { renderRoleBadge, mountAuthNav, applyPermissionVisibility, gateOrCta } from "./components/ui.js";
export { mount as mountPoll } from "./components/poll.component.js";
export { mountThread, buildTree } from "./components/comment.component.js";
export { mount as mountToc } from "./components/toc.component.js";
export { mount as mountGallery } from "./components/gallery.component.js";
export { mount as mountShare } from "./components/share.component.js";
export { mountToolbar } from "./components/moderation.component.js";
