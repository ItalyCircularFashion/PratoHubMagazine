/* ============================================================
import { getCurrentUser, isAuthenticated, login, logout, setMockUser, MOCK_USERS } from '../services/auth.js';
import { initReveal, initChipFilters, initNewsletterForm, initPagination, initSearchBars, wireSearchFilter, wireSortSelect, wireChipFilter, wireChipCategoryFilter, initVoteControls } from '../services/interaction.service.js';
import { mountBreadcrumbs, navigateTo, navigateBack } from '../services/navigation.service.js';
import { notifications } from '../data/notifications.data.js';
   NOTIFICATIONS.JS — composition for notifications.html.
   Reuses renderNotificationItem, wireSearchFilter, wireChipFilter,
   renderStatStrip, mountBreadcrumbs from existing platform.
   ============================================================ */

const user = getCurrentUser();
const all  = (notifications || []).filter(n => !user || n.userId === user.id);

mountBreadcrumbs('nBreadcrumbs', [
  { label:'Home', href:'index.html' },
  { label:'Notifications' },
]);

// ── Stats ──
function unreadCount(){ return all.filter(n => !n.isRead).length; }
function refreshStats(){
  const el = document.getElementById('nStats');
  if(el) el.replaceChildren(renderStatStrip([
    { value: all.length,      label:'Total' },
    { value: unreadCount(),   label:'Unread' },
    { value: all.length - unreadCount(), label:'Read' },
  ]));
}
refreshStats();

// ── Render list ──
// renderNotificationItem already adds .is-unread class via data.isRead.
// We wrap each item with data-read for the chip filter.
function buildList(){
  const grid = document.getElementById('nGrid');
  if(!grid) return;
  grid.innerHTML = '';
  if(!all.length){
    grid.appendChild(renderEmptyState('No notifications yet.', 'Activity from replies, mentions and accepted answers will appear here.'));
    return;
  }
  all.forEach(n => {
    const item = renderNotificationItem(n);
    // data-read drives the chip filter; "unread"/"read" as string values.
    item.dataset.read   = n.isRead ? 'read' : 'unread';
    item.dataset.title  = n.message.toLowerCase();
    // Mark as read on click (mutates in-memory; re-renders bell).
    item.addEventListener('click', () => {
      if(!n.isRead){
        n.isRead = true;
        item.classList.remove('is-unread');
        item.dataset.read = 'read';
        document.dispatchEvent(new CustomEvent('fdm:authchange')); // refreshes bell unread count
        refreshStats();
      }
    }, { once: false });
    grid.appendChild(item);
  });
}
buildList();

// ── Mark all as read ──
document.getElementById('markAllRead').addEventListener('click', () => {
  all.forEach(n => { n.isRead = true; });
  buildList();
  refreshStats();
  document.dispatchEvent(new CustomEvent('fdm:authchange'));
});

// ── Search ──
wireSearchFilter('#nSearch', '#nGrid', '.notification-item');

// ── Status chip filter (All / Unread / Read) ──
// wireChipFilter matches chip text against data-read exactly ("all" clears, "unread"/"read" filter).
wireChipFilter('#nStatusChips', '#nGrid', '.notification-item', 'read');