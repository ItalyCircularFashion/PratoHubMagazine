// ============================================================
// DATA.JS — PratoHub · sorgente dati (V4)
// ============================================================
// Sottostante consumato da tutti i moduli js/*.js tramite
// window.PH. OGNUNA delle sezioni qui sotto è un array di oggetti;
// il modulo JS la itera, non c'è nesso di causa-effetto con il CSS.
//
// COMPILAZIONE: sostituire i valori segnati [DA INSERIRE] con i tuoi
// dati, provenienti da fonti verificate (Istat, IRPET, Confindustria,
// sedi ufficiali, ecc.). Nessun dato qui è inventato: i valori vivi
// arrivano aggiungendo/rinominando le voci e riempiendo i campi.
// ============================================================

window.PH = {

  // ---- Fonti ----
  // Ogni fonte: { n: "nome", u: "URL" }.
  sources: {
    // es. irpet: { n: "IRPET, rapporto su Prato (dic. 2023)", u: "..." },
  },

  // ---- Numeri (cifre chiave del distretto) ----
  // { v: "2,8 mld €", l: "etichetta", y: anno/periodo, s: chiave fonte }
  stats: [
    // { v: "[DA INSERIRE]", l: "[etichetta]", y: "[anno]", s: "irpet" }
  ],

  // ---- Variazioni vs lo stesso periodo anno prima ----
  // { l: "etichetta", v: "+2,7%", p: "periodo", s: chiave fonte }
  variazioni: [],

  // ---- Territorio: 7 comuni del cerchio del Bisenzio ----
  // { n: "nome", p: residenti, r: descrizione, s: fonte }
  comuni: [],

  // ---- Aziende ----
  // { n: "nome", c: "categoria", m: "comune", v: [chiavi source "verificate"],
  //   f: "descrizione", d: "note" }
  aziende: [],

  // ---- Certificazioni e standard ----
  // { n: "nome", t: "descrizione", d: "note" }
  certs: [],

  // ---- Articoli ----
  // { t: "titolo", d: "testo/dettaglio" }
  articoli: [],

  // ---- Storia ----
  // { y: "anno/epoca", t: "titolo", d: "descrizione" }
  storia: [],

  // ---- Musei ----
  // { n: "nome", t: "descrizione", d: "note" }
  musei: [],

  // ---- Eventi ----
  // { t: "titolo", q: "data/caricattore", d: "descrizione" }
  eventi: [],

  // ---- Il ciclo del cardato (6 fasi) ----
  // { t: "fase", d: "descrizione" }
  cardato: [],

  // ---- Glossario ----
  // { t: "termine", d: "definizione" }
  glossario: []
};
