# GitHub Pages deployment

## Why you see "404 for main.tsx" / white screen

The repo has two kinds of content:

- **Source** (branch `main`): `index.html` points to `/src/main.tsx`. That file is not published as-is, so the server returns 404 and the app never loads.
- **Built site** (from the workflow): `index.html` points to `/eBayGermany/assets/...js`. That is what must be served for the app to work.

If GitHub Pages is set to **Deploy from a branch** and the branch is **main**, it serves the source → 404 and white screen.

## Correct setup (one-time)

1. Open the repo on GitHub: **Settings → Pages**.
2. Under **Build and deployment**:
   - **Source**: choose **"GitHub Actions"**.
3. Save. Do **not** use "Deploy from a branch" for this repo.

After that, every push to `main` runs the workflow, which builds the app and deploys the built files. The live site is then:

**https://ign-tunayilmaz.github.io/eBayGermany/**

## If it’s already wrong

1. Go to **Settings → Pages**.
2. If **Source** is "Deploy from a branch", change it to **"GitHub Actions"**.
3. Wait for the latest workflow run (Actions tab) to finish, then reload the URL above.

No need to create or select a branch; the workflow publishes the built artifact for GitHub Pages.
