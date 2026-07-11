/* ============================================================
   HOME.JS — page-specific data + wiring for index.html only.
   All rendering logic, market engine and site-wide behaviours
   live in main.js and are already initialised by the time this
   file runs.
   ============================================================ */

const agenda = [
  ["Manufacturing","Inside the Last Mile of Italian Knitwear","Marco Bianchi","6 min"],
  ["AI","Can a Model Learn to Spot a Bad Hem?","Sofia Rossi","5 min"],
  ["Circular Fashion","The Economics of Recycled Cashmere","Giulia Ferrari","8 min"],
  ["Retail","Why Flagship Stores Are Shrinking","Tommaso Greco","4 min"],
  ["Streetwear","Tokyo's Archive Market, Explained","Yuki Tanaka","7 min"],
  ["Business","Margins in the Age of Tariffs","Laura Conti","6 min"],
];
const news = [
  {lead:true, cat:"Luxury", title:"The Quiet Power Shift Inside LVMH's Atelier Network", author:"Isabella Romano", time:"12 min", date:"Jun 26", seed:"atelier1"},
  {cat:"Innovation", title:"Bio-Based Dyes Are Finally Ready for Mass Production", author:"Davide Russo", time:"6 min", date:"Jun 26", seed:"dyevat2"},
  {cat:"Business", title:"What Retailers Got Wrong About Gen Z Spending", author:"Chiara Bruno", time:"5 min", date:"Jun 25", seed:"retail3"},
  {cat:"Runway", title:"Five Silhouettes That Defined This Season", author:"Anna Moretti", time:"4 min", date:"Jun 25", seed:"runway4"},
  {cat:"Materials", title:"Inside the Lab Growing Leather From Mycelium", author:"Paolo Ricci", time:"7 min", date:"Jun 24", seed:"mycel5"},
];
const discussions = [
  ["Manufacturing","Best ERP for managing 6 subcontractor sites at once?","217","48", ["a1","a2","a3"]],
  ["Sustainability","Is 'deadstock' fabric actually solving anything?","189","63", ["a4","a5","a6"]],
  ["AI","Which AI tools are textile mills actually using in 2026?","301","91", ["a7","a8","a9"]],
  ["Fashion Business","How are you pricing in tariff volatility right now?","156","37", ["a10","a11"]],
  ["Pattern Making","Grading for petite sizing — sharing my block adjustments","98","22", ["a12","a13","a14"]],
];
const questions = [
  {tags:["Textile Engineering","Quality Control"], q:"How do you set acceptable defect tolerance for jacquard weaving?", expert:"Renzo Galli", role:"Textile Engineer, 22 yrs", seed:"exp1", accepted:true},
  {tags:["Supply Chain","Fashion Law"], q:"What actually changes in contracts once a supplier is GOTS certified?", expert:"Marta Sani", role:"Compliance Lead", seed:"exp2", accepted:true},
  {tags:["Pattern Making"], q:"Best approach for grading a fitted blazer across 8 sizes?", expert:"Luca De Luca", role:"Pattern Maker", seed:"exp3", accepted:false},
  {tags:["Manufacturing","Materials"], q:"Ring-spun vs open-end yarn — when does the cost difference matter?", expert:"Federica Costa", role:"Production Planner", seed:"exp4", accepted:true},
];
const events = [
  ["27","JUN","Trade Show","Pitti Filati — Florence"],
  ["03","JUL","Webinar","Traceability in the Wool Supply Chain"],
  ["14","JUL","Fashion Week","Milano Moda Donna Previews"],
  ["29","JUL","Meetup","Forum della Moda — Prato Community Night"],
];
const picks = [
  ["Editor's Pick","The Last Artisanal Dye House in Prato", "pick1"],
  ["Editor's Pick","Why Slow Fashion Needs Fast Logistics", "pick2"],
  ["Editor's Pick","A Pattern Maker's Notebook, Annotated", "pick3"],
  ["Editor's Pick","The Spreadsheet That Runs a Mill", "pick4"],
];

document.getElementById('agendaRail').append(...agenda.map(renderAgendaCard));
document.getElementById('newsGrid').append(...news.map(renderNewsCard));
document.getElementById('discList').append(...discussions.map(renderDiscussionRow));
document.getElementById('qGrid').append(...questions.map(renderQuestionCard));
document.getElementById('eventsRail').append(...events.map(renderEventCard));
document.getElementById('picksStrip').append(...picks.map(renderPick));
mountMarketGrid('marketGrid', commodities);

// ---- Subtle parallax on the contained hero image (homepage hero only) ----
const heroEl = document.getElementById('hero');
const heroImg = document.getElementById('heroImgMain');
if(heroEl && heroImg){
  window.addEventListener('scroll', () => {
    const y = Math.min(Math.max(window.scrollY, 0), heroEl.offsetHeight);
    heroImg.style.transform = `scale(1.08) translateY(${y * 0.06}px)`;
  }, {passive:true});
}
