/* ============================================================
   NOTIFICATIONS SEED DATA
   assets/data/notifications.data.js
   Populates the existing notification.model.js. Not yet wired
   to a notifications.html page (out of scope for this pass) —
   this is content for that future page plus the existing
   auth-nav notification bell indicator.
   ============================================================ */
window.FDM = window.FDM || {};
FDM.data = FDM.data || {};

FDM.data.notifications = [
  FDM.models.createNotification({
    id:'n-1', userId:'u-201', type:'accepted_answer', actorNickname:'federica.costa',
    message:'Your reply was marked the accepted answer on "Best ERP for managing 6 subcontractor sites at once?"',
    link:'thread.html', isRead:false, createdAt:'2026-06-20T13:41:00Z',
  }),
  FDM.models.createNotification({
    id:'n-2', userId:'u-201', type:'reply', actorNickname:'marco.villa',
    message:'marco.villa replied to a thread you follow: "Best ERP for managing 6 subcontractor sites at once?"',
    link:'thread.html', isRead:false, createdAt:'2026-06-22T08:31:00Z',
  }),
  FDM.models.createNotification({
    id:'n-3', userId:'u-201', type:'mention', actorNickname:'isabella.romano',
    message:'isabella.romano mentioned you in a comment on "Inside the Tariff Spreadsheet Every Sourcing Director Is Now Quietly Sharing"',
    link:'article.html', isRead:false, createdAt:'2026-06-28T10:03:00Z',
  }),
  FDM.models.createNotification({
    id:'n-4', userId:'u-201', type:'vote', actorNickname:'community',
    message:'Your reply on the ERP discussion just crossed 40 votes.',
    link:'thread.html', isRead:true, createdAt:'2026-06-21T16:00:00Z',
  }),
  FDM.models.createNotification({
    id:'n-5', userId:'u-201', type:'event', actorNickname:'PratoHub Magazine',
    message:'Reminder: "AI-Based Defect Detection" webinar starts in 3 days.',
    link:'events.html', isRead:true, createdAt:'2026-07-08T09:00:00Z',
  }),
  FDM.models.createNotification({
    id:'n-6', userId:'u-201', type:'follow', actorNickname:'chiara.visentin',
    message:'chiara.visentin started following you.',
    link:'community.html', isRead:true, createdAt:'2026-06-19T11:20:00Z',
  }),
  FDM.models.createNotification({
    id:'n-7', userId:'u-201', type:'admin_announcement', actorNickname:'PratoHub Magazine',
    message:'New Market Intelligence indicators added: Recycled Polyester and Indigo Dye Index are now tracked.',
    link:'market.html', isRead:true, createdAt:'2026-06-26T09:00:00Z',
  }),
  FDM.models.createNotification({
    id:'n-8', userId:'u-201', type:'moderation', actorNickname:'mod.alice',
    message:'A reply you reported on "Pilling test results inconsistent between two labs" was removed for promotional content.',
    link:'discussions.html', isRead:true, createdAt:'2026-06-23T14:15:00Z',
  }),
];
