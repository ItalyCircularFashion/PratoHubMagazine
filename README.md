# PratoHub Magazine — Forum della Moda

ESM-first static site for fashion/textile discussion, market data, knowledge graph, notifications, questions, and Ecobalyse sustainability insights.

## Technology stack

- Vite
- Vanilla JavaScript / ES Modules
- Semantic HTML5
- CSS3

## Architecture overview

- Entry: `assets/esm-entry.js`
- Pages/controllers: `assets/pages/*.js`
- Components: `assets/components/*.js`
- Services: `assets/services/*.js`
- Renderers: `assets/renderers/*.js`
- Models: `assets/models/*.js`
- Data: `assets/data/*.js`
- Utils: `assets/utils/*.js`
- Permissions: `assets/permissions/*.js`
- Styles: `assets/styles/*.css`
- Public: `public/`

## Local development

```bash
npm install
npm run build
npm run dev
```

## Deployment

Deploy `dist/` to GitHub Pages (branch `main`, folder `/`) or any static host.
Build command: `npm run build` — output directory: `dist`.

## Note on data

Company and expert data in `assets/data/` are demo / fictional sample data for
demonstration purposes only. VAT numbers, REA codes, certifications and company
names do not refer to real entities and must not be treated as factual records.

## License

MIT — see `LICENSE`.
