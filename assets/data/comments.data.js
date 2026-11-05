/* ============================================================
   COMMENTS SEED DATA
   assets/data/comments.data.js
   Flat list across every target (articles, discussions,
   questions) — FDM.commentService filters by targetType/targetId.
   ============================================================ */
window.FDM = window.FDM || {};
FDM.data = FDM.data || {};

FDM.data.comments = [
  FDM.models.createComment({
    id:'ac-1', targetType:'article', targetId:'art-tariff-spreadsheet', authorId:'u-2',
    body:"Editor's note: we've corrected the mill count in paragraph four — three mills confirmed, not four.",
    isPinned:true, roleBadgeAtPost:'admin', createdAt:'2026-06-27T14:40:00Z',
  }),
  FDM.models.createComment({
    id:'ac-2', targetType:'article', targetId:'art-tariff-spreadsheet', authorId:'exp-marta',
    body:"Worth flagging: the duty-rate column in that spreadsheet only reflects HS codes for woven fabric, not finished garments. The exposure looks different once you add CMT.",
    roleBadgeAtPost:'expert', voteCount:34, createdAt:'2026-06-27T16:05:00Z',
  }),
  FDM.models.createComment({
    id:'ac-3', targetType:'article', targetId:'art-tariff-spreadsheet', parentId:'ac-2', authorId:'u-201',
    body:'This matches what we are seeing too — CMT-inclusive landed cost moved less than the headline duty rate would suggest.',
    voteCount:11, createdAt:'2026-06-27T17:30:00Z',
  }),
  FDM.models.createComment({
    id:'ac-4', targetType:'article', targetId:'art-tariff-spreadsheet', authorId:'u-201',
    body:'Does anyone have visibility into how the freight forwarder mentioned here is pricing the re-routing scenario?',
    voteCount:6, createdAt:'2026-06-28T07:10:00Z',
  }),
  FDM.models.createComment({
    id:'ac-5', targetType:'article', targetId:'art-tariff-spreadsheet', authorId:'exp-federica',
    body:'We saw the same routing logic surface independently in a planning meeting last week — once one sourcing director shares a workaround, it travels through a district like Prato in days, not months.',
    roleBadgeAtPost:'expert', voteCount:21, createdAt:'2026-06-28T09:45:00Z',
  }),
  FDM.models.createComment({
    id:'ac-6', targetType:'article', targetId:'art-tariff-spreadsheet', parentId:'ac-5', authorId:'u-2',
    body:'That informal-network effect is worth its own piece — flagging for the desk.',
    roleBadgeAtPost:'admin', voteCount:8, createdAt:'2026-06-28T10:02:00Z',
  }),
  FDM.models.createComment({
    id:'ac-7', targetType:'article', targetId:'art-tariff-spreadsheet', authorId:'exp-marta',
    body:'One more nuance: the "days to re-route" column assumes the destination port has spare customs capacity. Two of our shipments cleared three days slower than the sheet predicted purely on congestion, not duty processing.',
    roleBadgeAtPost:'expert', voteCount:16, createdAt:'2026-06-28T11:20:00Z',
  }),
  // Discussion thread: disc-erp ("Best ERP for managing 6 subcontractor sites at once?")
  FDM.models.createComment({
    id:'td-0', targetType:'discussion', targetId:'disc-erp', authorId:'u-2',
    body:'Moderator note: please keep ERP vendor comparisons factual and avoid promotional language.',
    isPinned:true, roleBadgeAtPost:'admin', createdAt:'2026-06-20T08:00:00Z',
  }),
  FDM.models.createComment({
    id:'td-1', targetType:'discussion', targetId:'disc-erp', authorId:'u-201',
    body:'We ended up standardising on a single ERP with a multi-site module rather than running separate instances per site — the reconciliation overhead alone was eating two days a month.',
    voteCount:18, createdAt:'2026-06-20T10:15:00Z',
  }),
  FDM.models.createComment({
    id:'td-2', targetType:'discussion', targetId:'disc-erp', authorId:'exp-federica',
    body:'For six sites the real question is whether your subcontractors need write access or just visibility. We run one core ERP with read-only portals per terzista — full write access for six external parties is a support burden you do not want.',
    isAcceptedAnswer:true, roleBadgeAtPost:'expert', voteCount:47, createdAt:'2026-06-20T13:40:00Z',
    attachments:[{ name:'erp-comparison-template.xlsx', url:'#', type:'spreadsheet' }],
  }),
  FDM.models.createComment({
    id:'td-3', targetType:'discussion', targetId:'disc-erp', parentId:'td-2', authorId:'u-201',
    body:'This matches what we landed on too — read-only portals plus a weekly batch import for completed lots.',
    voteCount:9, createdAt:'2026-06-20T15:05:00Z',
  }),
  FDM.models.createComment({
    id:'td-4', targetType:'discussion', targetId:'disc-erp', authorId:'exp-renzo',
    body:"Worth adding: the integration cost is almost never the ERP licence itself, it's the EDI mapping between your system and whatever each subcontractor already runs. We budgeted three weeks per site for mapping alone, and that estimate held for four of six sites — the other two needed custom connectors because their existing software was over a decade old and had no modern export format, which pushed the timeline out by another month and a half in total.",
    roleBadgeAtPost:'expert', voteCount:14, isCollapsed:true, createdAt:'2026-06-21T09:20:00Z',
  }),
  FDM.models.createComment({
    id:'td-5', targetType:'discussion', targetId:'disc-erp', parentId:'td-4', authorId:'exp-federica',
    body:'Same experience on our side — budget the custom connector cost separately from the licence quote, vendors almost never include it upfront.',
    roleBadgeAtPost:'expert', voteCount:7, createdAt:'2026-06-21T10:05:00Z',
  }),
  FDM.models.createComment({
    id:'td-6', targetType:'discussion', targetId:'disc-erp', authorId:'exp-marco',
    body:'From a maintenance angle: whichever ERP you pick, make sure machine downtime events feed into it automatically. Manually logging downtime across six sites is where the data quality always breaks down first.',
    roleBadgeAtPost:'expert', voteCount:12, createdAt:'2026-06-22T08:30:00Z',
  }),
  FDM.models.createComment({
    id:'td-7', targetType:'discussion', targetId:'disc-erp', authorId:'u-201',
    body:'Good point — we ended up bolting on a simple IoT downtime logger per loom precisely because manual entry was unreliable past two sites.',
    voteCount:5, createdAt:'2026-06-22T09:10:00Z',
  }),
  // ----- Answers for q-jacquard -----
  FDM.models.createComment({
    id:'qa-jacquard-1', targetType:'question', targetId:'q-jacquard', authorId:'exp-renzo',
    body:`The industry benchmark for jacquard weaving defect tolerance depends heavily on end-use and construction complexity. For luxury upholstery and apparel the typical accepted tolerance is **≤3.5 defect points per 100 m²** using the 4-point system. For standard decorative fabric the ceiling rises to 6–8 points.\n\nKey parameters to define before setting your threshold:\n- **Pattern repeat length** — longer repeats amplify the impact of a single defect\n- **Base yarn count** — Ne 20 and finer will register broken ends more visibly\n- **Buyer SLA** — some luxury accounts run their own 10-point inspection on receipt\n\nPractical starting point: run 10 production batches through your current inspection system, plot the natural defect distribution, then set the acceptance threshold at **mean + 1.5σ**. That gives you a defensible, data-driven limit rather than one copied from a generic spec sheet.`,
    isAcceptedAnswer:true, roleBadgeAtPost:'expert', voteCount:84,
    createdAt:'2026-06-18T11:30:00Z', editedAt:'2026-06-19T08:00:00Z',
  }),
  FDM.models.createComment({
    id:'qa-jacquard-2', targetType:'question', targetId:'q-jacquard', authorId:'exp-sofia',
    body:'From the lab side: make sure your defect inspectors are calibrated to the same reference standard before you set a threshold. We ran an inter-rater reliability study across three inspectors on the same 50 m roll and saw a 22% variance in total point scores. That variance alone exceeded the tolerance limit on two of our accounts. Standardise the *process* before you standardise the *number*.',
    roleBadgeAtPost:'expert', voteCount:41, createdAt:'2026-06-18T13:45:00Z',
  }),
  FDM.models.createComment({
    id:'qa-jacquard-3', targetType:'question', targetId:'q-jacquard', parentId:'qa-jacquard-1', authorId:'u-201',
    body:'The mean+1.5σ approach is very useful — we applied it to our plain-weave line last year and it cut false-rejection rate by roughly 18%. Will try it here.',
    voteCount:7, createdAt:'2026-06-18T14:20:00Z',
  }),
  FDM.models.createComment({
    id:'qa-jacquard-4', targetType:'question', targetId:'q-jacquard', authorId:'exp-paolo',
    body:'One operational note: the tolerance should be set per product family, not per loom. We made the mistake of setting a single threshold for the shed and found that our older rapier looms were systematically failing while our newer air-jets easily cleared it — leading to false signals about *machine* health rather than *product* quality.',
    roleBadgeAtPost:'expert', voteCount:29, createdAt:'2026-06-19T09:10:00Z',
  }),
  FDM.models.createComment({
    id:'qa-jacquard-5', targetType:'question', targetId:'q-jacquard', authorId:'u-201',
    body:'Does the 4-point system adequately capture floating-thread defects in multi-layer jacquard, or does it need supplementary criteria?',
    voteCount:11, createdAt:'2026-06-20T10:00:00Z',
  }),
  FDM.models.createComment({
    id:'qa-jacquard-6', targetType:'question', targetId:'q-jacquard', parentId:'qa-jacquard-5', authorId:'exp-renzo',
    body:'For multi-layer constructions the 4-point system under-penalises layer-separation defects. We add a supplementary criterion: any defect crossing more than one layer in the Z-direction is automatically classified as a critical defect and triggers quarantine regardless of the running point total.',
    roleBadgeAtPost:'expert', voteCount:18, createdAt:'2026-06-20T11:30:00Z',
  }),
  // ----- Answers for q-shrinkage -----
  FDM.models.createComment({
    id:'qa-shrinkage-1', targetType:'question', targetId:'q-shrinkage', authorId:'exp-sofia',
    body:`Standard acceptable residual shrinkage for cotton twill after one domestic wash (40 °C) is typically **≤3% warp / ≤2% weft** for apparel end-uses under EN ISO 6330 or AATCC 135.\n\nFor workwear or institutional laundry (60–90 °C cycles) reduce that to **≤2% / ≤1.5%** because repeated high-temperature washes compound the residual.\n\nFactors that most commonly push fabric outside tolerance:\n- Insufficient pre-relaxation time before cutting (< 48 h on roll)\n- Mercerisation tension not fully relieved before finishing\n- Stenter overfeed set below 3% on warp direction\n\nAlways test at least 3 production lots before locking a spec — natural fibre batches show significant inter-lot variation.`,
    isAcceptedAnswer:true, roleBadgeAtPost:'expert', voteCount:67,
    createdAt:'2026-06-09T12:15:00Z',
  }),
  FDM.models.createComment({
    id:'qa-shrinkage-2', targetType:'question', targetId:'q-shrinkage', authorId:'exp-anna',
    body:'From finishing: we get the most consistent shrinkage results when the stenter overfeed is set relative to the greige fabric width, not the finished target width. A lot of mills set it against the target and end up under-feeding on batches where greige width varies by more than 2 cm.',
    roleBadgeAtPost:'expert', voteCount:22, createdAt:'2026-06-09T14:30:00Z',
  }),
  FDM.models.createComment({
    id:'qa-shrinkage-3', targetType:'question', targetId:'q-shrinkage', parentId:'qa-shrinkage-1', authorId:'u-201',
    body:'The pre-relaxation point is critical — we moved from 24 h to 72 h and brought warp shrinkage down from 4.1% to 2.8% without any other process change.',
    voteCount:9, createdAt:'2026-06-10T08:30:00Z',
  }),
];
