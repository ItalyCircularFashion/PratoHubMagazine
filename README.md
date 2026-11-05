# PratoHub Magazine — nuova base

Magazine ricostruito dai materiali di luglio e sezione `distretto/` dalla versione 2 fornita dall’utente. I due ZIP di luglio hanno contenuti identici: ne è stata adottata una sola copia, ricomponendo i percorsi originali.

## Dati

La directory `assets/data/companies.public.js` contiene esclusivamente aziende reali con fonti ufficiali e date di consultazione; gli adapter di Magazine e Distretto usano la stessa sorgente. Non sono importati database riservati né valori societari o certificazioni presunti. Gli altri dataset del magazine (articoli, profili, commenti, eventi, mercato) sono esempi dichiarati e separati dalle imprese reali.

## Esecuzione e verifica

- `npm test`: sintassi e integrità statica.
- `npm run build`: copia solo le risorse pubblicabili in `dist/`; nessuna dipendenza runtime.
- `npm run preview`: anteprima loopback sulla porta 4173.
- `npm run test:e2e`: build, server isolato sul sottopercorso Pages e test browser di Magazine e Distretto; report in `test-results/`.

Prerequisiti dei test: `npm ci --ignore-scripts` e `npx playwright install chromium`, oppure impostare `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` per un Chromium già disponibile. `SITE_BASE` permette di verificare anche il sito pubblicato; le interazioni di prova non vengono inviate al server.

Il sito è pubblicato su GitHub Pages da `main` alla radice; `dist/` è solo l’artefatto locale verificabile, non una seconda sorgente da modificare. Backup, ZIP originali e report di lavoro restano esterni al publish set. Le dipendenze npm sono esclusivamente per i test browser.

## Limiti

Non esistono autenticazione server, account, newsletter o community condivisa. Le interazioni rimangono nella pagina e non vengono conservate. Le fonti aziendali non equivalgono a visure o audit di certificazione. Vedi `progetto.html`.
