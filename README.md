# Stanovništvo FBiH

Interactive, hand-textured infographic of chapter 5 (population) of *Federacija Bosne i Hercegovine u brojkama 2026* (Institute for Statistics of the FBiH). English and Bosnian.

No build step. Plain HTML, CSS and JS.

## Run locally
Open the folder in VS Code, install the **Live Server** extension, right-click `index.html` and choose *Open with Live Server*. Or run `python3 -m http.server` and open http://localhost:8000.

## Publish on GitHub Pages
1. Create an empty repo on GitHub.
2. In the VS Code terminal:
   ```
   git init
   git add .
   git commit -m "Population infovis"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
3. On GitHub: Settings > Pages > Source: **GitHub Actions**. The included workflow deploys on every push to `main`.

## Structure
- `index.html` markup and SVG filters
- `src/base.css` layout and colour tokens (light and dark)
- `src/tactile.css` paper grain, wobble edges, ink, tape, marker
- `src/app.js` data (inline) and all charts

## Data notes
The 2013 pyramid values are read off a chart printed without numbers, so they are approximate. Table 5.2 (census by municipality) is a map without figures and is not included. Shares, the 65+ per 100 children index and sex ratio are calculated.

Source: Institute for Statistics of the FBiH, *Federacija Bosne i Hercegovine u brojkama 2026*, chapter 5. Cite the source (CC BY).
