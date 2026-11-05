/* ============================================================
   POLLS SEED DATA
   assets/data/polls.data.js
   ============================================================ */
window.FDM = window.FDM || {};
FDM.data = FDM.data || {};

FDM.data.polls = [
  FDM.models.createPoll({
    id:'poll-tariff', targetType:'article', targetId:'art-tariff-spreadsheet',
    question:'Has your sourcing strategy changed because of the new tariffs?',
    options:[
      { id:'yes', label:'Yes — actively re-routing', votes:412 },
      { id:'considering', label:'Considering it', votes:268 },
      { id:'no', label:'No change yet', votes:151 },
    ],
  }),
  FDM.models.createPoll({
    id:'poll-microfiber', targetType:'article', targetId:'art-microfiber-shedding',
    question:'Has your mill invested in microfiber filtration at the washing or finishing stage?',
    options:[
      { id:'yes-washing', label:'Yes, at washing stage', votes:184 },
      { id:'yes-finishing', label:'Yes, at finishing stage', votes:96 },
      { id:'evaluating', label:'Evaluating options', votes:221 },
      { id:'no', label:'Not yet', votes:143 },
    ],
  }),
];
