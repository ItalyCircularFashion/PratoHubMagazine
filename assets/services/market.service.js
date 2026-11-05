/* ============================================================
   MARKET SERVICE
   assets/services/market.service.js

   Mock data shaped exactly like a real feed would return it.
   Swap `commodities` for a fetch() to Trading Economics / ICE
   Futures / Yahoo Finance / an internal ERP endpoint — no
   markup or card changes required anywhere on the site.
   Shape: { name, unit, value, changeDaily, changeWeekly, changeMonthly, series, updatedAt }
   ============================================================ */
window.FDM = window.FDM || {};

function genSeries(seed, points=14){
  let s = seed; const rnd = () => { s = (s*9301+49297)%233280; return s/233280; };
  let v = 50; const out=[];
  for(let i=0;i<points;i++){ v += (rnd()-0.5)*6; out.push(v); }
  return out;
}
const commodities = [
  {name:"Cotton", unit:"USD / lb", value:0.82, changeDaily:0.6, changeWeekly:1.4, changeMonthly:-2.1, seed:11},
  {name:"Wool", unit:"AUD / kg (clean)", value:14.35, changeDaily:-0.3, changeWeekly:0.8, changeMonthly:3.2, seed:22},
  {name:"Silk", unit:"USD / kg", value:48.20, changeDaily:0.1, changeWeekly:-0.6, changeMonthly:1.1, seed:33},
  {name:"Polyester", unit:"USD / ton", value:1120, changeDaily:-0.8, changeWeekly:-1.2, changeMonthly:-0.4, seed:44},
  {name:"Viscose", unit:"USD / ton", value:980, changeDaily:0.4, changeWeekly:0.9, changeMonthly:2.0, seed:55},
  {name:"Linen", unit:"EUR / kg", value:6.10, changeDaily:0.2, changeWeekly:0.3, changeMonthly:0.7, seed:66},
  {name:"Cashmere", unit:"USD / kg", value:92.50, changeDaily:1.1, changeWeekly:2.6, changeMonthly:4.8, seed:77},
  {name:"Leather", unit:"USD / sq ft", value:3.95, changeDaily:-0.2, changeWeekly:-0.5, changeMonthly:-1.6, seed:88},
  {name:"Natural Gas", unit:"USD / MMBtu", value:2.74, changeDaily:1.8, changeWeekly:3.1, changeMonthly:6.4, seed:99},
  {name:"Brent Oil", unit:"USD / barrel", value:81.30, changeDaily:-0.5, changeWeekly:1.0, changeMonthly:-3.3, seed:110},
  {name:"Electricity", unit:"EUR / MWh (IT)", value:118.40, changeDaily:0.9, changeWeekly:2.2, changeMonthly:5.5, seed:121},
  {name:"EUR / USD", unit:"FX", value:1.082, changeDaily:0.1, changeWeekly:-0.2, changeMonthly:0.6, seed:132},
  {name:"USD / CNY", unit:"FX", value:7.21, changeDaily:-0.1, changeWeekly:0.1, changeMonthly:-0.3, seed:143},
  {name:"Acrylic Fiber", unit:"USD / kg", value:2.18, changeDaily:0.3, changeWeekly:0.5, changeMonthly:-0.8, seed:154},
  {name:"Recycled Polyester", unit:"USD / kg", value:1.45, changeDaily:0.7, changeWeekly:1.6, changeMonthly:3.4, seed:165},
  {name:"Elastane", unit:"USD / kg", value:5.60, changeDaily:-0.4, changeWeekly:-0.9, changeMonthly:1.2, seed:176},
  {name:"Indigo Dye Index", unit:"USD / kg", value:9.85, changeDaily:0.2, changeWeekly:0.4, changeMonthly:-1.1, seed:187},
].map(c => ({...c, series: genSeries(c.seed), updatedAt: "DEMO · source period not applicable"}));

function trendClass(n){ return n > 0.05 ? 'pos' : n < -0.05 ? 'neg' : 'flat'; }
function sparkSvg(series, cls){
  const w=160, h=40, min=Math.min(...series), max=Math.max(...series), range=(max-min)||1;
  const pts = series.map((v,i)=>{
    const x = (i/(series.length-1))*w;
    const y = h - ((v-min)/range)*h*0.82 - h*0.09;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const colorVar = cls==='pos' ? 'var(--mkt-pos)' : cls==='neg' ? 'var(--mkt-neg)' : 'var(--mkt-neutral)';
  return `<svg class="mkt-spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <polyline points="${pts}" fill="none" stroke="${colorVar}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}
function fullCard(c){
  const cls = trendClass(c.changeDaily);
  const arrow = cls==='pos' ? '▲' : cls==='neg' ? '▼' : '·';
  const fmt = (n) => `${n>0?'+':''}${n}%`;
  return el(`<div class="mkt-card" data-commodity="${c.name}">
    <div class="mkt-top">
      <div><div class="mkt-name">${c.name}</div><div class="mkt-unit">${c.unit}</div></div>
      <div class="mkt-updated">${c.updatedAt}</div>
    </div>
    <div class="mkt-value-row">
      <span class="mkt-value">${c.value}</span>
      <span class="mkt-change ${cls}">${arrow} ${Math.abs(c.changeDaily)}%</span>
    </div>
    ${sparkSvg(c.series, cls)}
    <div class="mkt-trends">
      <div class="mkt-trend">1D <b class="${cls}">${fmt(c.changeDaily)}</b></div>
      <div class="mkt-trend">7D <b class="${trendClass(c.changeWeekly)}">${fmt(c.changeWeekly)}</b></div>
      <div class="mkt-trend">30D <b class="${trendClass(c.changeMonthly)}">${fmt(c.changeMonthly)}</b></div>
    </div>
  </div>`);
}
function compactCard(c){
  const cls = trendClass(c.changeDaily);
  const arrow = cls==='pos' ? '▲' : cls==='neg' ? '▼' : '·';
  return el(`<div class="mkt-card mkt-card--compact" data-commodity="${c.name}">
    <div class="mkt-cleft">
      <div class="mkt-name">${c.name}</div>
      <div class="mkt-value-row"><span class="mkt-value">${c.value}</span><span class="mkt-change ${cls}">${arrow} ${Math.abs(c.changeDaily)}%</span></div>
    </div>
    ${sparkSvg(c.series, cls)}
  </div>`);
}
const byName = (n) => commodities.find(c => c.name === n);

function mountMarketTickers(){
  const tickerLeft = document.getElementById('tickerLeft');
  const tickerRight = document.getElementById('tickerRight');
  if(!tickerLeft || !tickerRight) return;
  const leftItems = ["Cotton","Wool","Cashmere","Silk"].map(byName);
  const rightItems = ["Brent Oil","Natural Gas","Electricity","EUR / USD"].map(byName);
  tickerLeft.append(...leftItems.map(compactCard));
  tickerRight.append(...rightItems.map(compactCard));

  const tickerEls = [...document.querySelectorAll('.market-ticker')];
  const startEl = document.getElementById('featured') || document.querySelector('.hero') || document.querySelector('.page-header');
  const endEl = document.querySelector('.newsletter');
  const update = () => {
    const startY = startEl ? startEl.offsetTop + startEl.offsetHeight*0.4 : 0;
    const endY = endEl ? endEl.offsetTop - 200 : Infinity;
    const active = window.scrollY > startY && window.scrollY < endY;
    tickerEls.forEach(t => t.classList.toggle('is-active', active));
  };
  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  update();
}
function mountMarketGrid(targetId, data){
  const grid = document.getElementById(targetId || 'marketGrid');
  if(grid) grid.append(...(data || commodities).map(fullCard));
}

FDM.market = { commodities, genSeries, trendClass, sparkSvg, fullCard, compactCard, byName, mountMarketTickers, mountMarketGrid };

mountMarketTickers();
