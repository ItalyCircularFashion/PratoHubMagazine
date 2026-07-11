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
```

## Deployment

Deploy `dist/` to a static host with SPA fallback. See `output/ph28/` and `output/deploy01/` for hosting notes.

## Documentation

- Release notes: `output/release/RELEASE_NOTES_v1.0.0.md`
- Certification: `output/release/FINAL_CERTIFICATION.md`
