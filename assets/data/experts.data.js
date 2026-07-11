import { createUser } from '../models/user.model.js';

/* ============================================================
   EXPERTS SEED DATA
   assets/data/experts.data.js
   Small central cast of verified experts that article.html,
   discussion threads and question pages can all reference by
   id — this is what makes "related experts" a real lookup
   instead of a hardcoded name per page.
   ============================================================ */

export const experts = [
  createUser({
    id:'exp-renzo', nickname:'renzo.galli', role:'expert', verifiedExpert:true,
    professionalRole:'Textile Engineer, 22 yrs', country:'Italy',
    expertise:['Textile Engineering','Quality Control','Jacquard Weaving'],
    avatarUrl:'https://picsum.photos/seed/prato-expert-textile/120/120', reputation:3120, badges:['Verified Expert'],
  }),
  createUser({
    id:'exp-marta', nickname:'marta.sani', role:'expert', verifiedExpert:true,
    professionalRole:'Compliance Lead', country:'Italy',
    expertise:['Supply Chain','Fashion Law','GOTS Certification'],
    avatarUrl:'https://picsum.photos/seed/prato-expert-dye/120/120', reputation:2480, badges:['Verified Expert'],
  }),
  createUser({
    id:'exp-luca', nickname:'luca.deluca', role:'expert', verifiedExpert:true,
    professionalRole:'Pattern Maker', country:'Italy',
    expertise:['Pattern Making','Grading'],
    avatarUrl:'https://picsum.photos/seed/prato-expert-weave/120/120', reputation:1910, badges:['Verified Expert'],
  }),
  createUser({
    id:'exp-federica', nickname:'federica.costa', role:'expert', verifiedExpert:true,
    professionalRole:'Production Planner', country:'Italy',
    expertise:['Manufacturing','Materials','Yarn Sourcing'],
    avatarUrl:'https://picsum.photos/seed/prato-expert-lab/120/120', reputation:1650, badges:['Verified Expert'],
  }),
  createUser({
    id:'exp-chiara', nickname:'chiara.visentin', role:'expert', verifiedExpert:true,
    professionalRole:'Dyehouse Manager, 18 yrs', country:'Italy',
    expertise:['Dyeing','Colour Matching','Batch Consistency'],
    avatarUrl:'https://picsum.photos/seed/prato-expert-circular/120/120', reputation:2210, badges:['Verified Expert'],
  }),
  createUser({
    id:'exp-paolo', nickname:'paolo.ferraris', role:'expert', verifiedExpert:true,
    professionalRole:'Weaving Shed Supervisor', country:'Italy',
    expertise:['Weaving','Loom Maintenance','OEE'],
    avatarUrl:'https://picsum.photos/seed/prato-expert-qa/120/120', reputation:1840, badges:['Verified Expert'],
  }),
  createUser({
    id:'exp-sofia', nickname:'sofia.bianchi', role:'expert', verifiedExpert:true,
    professionalRole:'Textile Lab Manager', country:'Italy',
    expertise:['Laboratory Testing','AATCC / ISO Standards','Colorfastness'],
    avatarUrl:'https://picsum.photos/seed/prato-expert-tech/120/120', reputation:2670, badges:['Verified Expert'],
  }),
  createUser({
    id:'exp-davide', nickname:'davide.moretti', role:'expert', verifiedExpert:true,
    professionalRole:'Sustainability Engineer', country:'Italy',
    expertise:['LCA','Water Treatment','Microfiber Shedding'],
    avatarUrl:'https://picsum.photos/seed/prato-expert-maint/120/120', reputation:1530, badges:['Verified Expert'],
  }),
  createUser({
    id:'exp-anna', nickname:'anna.conti.finishing', role:'expert', verifiedExpert:true,
    professionalRole:'Finishing Department Head', country:'Italy',
    expertise:['Finishing','Shrinkage Control','Calendering'],
    avatarUrl:'https://picsum.photos/seed/prato-expert-planning/120/120', reputation:1980, badges:['Verified Expert'],
  }),
  createUser({
    id:'exp-marco', nickname:'marco.villa', role:'expert', verifiedExpert:true,
    professionalRole:'Maintenance Engineer', country:'Italy',
    expertise:['Predictive Maintenance','Mechanical Systems','Spare Parts Planning'],
    avatarUrl:'https://picsum.photos/seed/prato-expert-ops/120/120', reputation:1410, badges:['Verified Expert'],
  }),
];
