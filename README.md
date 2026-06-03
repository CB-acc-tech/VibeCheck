<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/078858d5-f20d-410f-a5e8-af1829b5ba96

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deployment (Render - recommended for Node apps)

1. Push this repository to GitHub.
2. Go to Render (https://render.com) and create a new Web Service.
3. Connect your GitHub repo and pick the `vibecheck` repository.
4. Use these settings:
   - Build Command: `npm ci && npm run build`
   - Start Command: `npm start`
   - Environment: `Node`
5. Add a secret named `GEMINI_API_KEY` in the Render dashboard (Environment → Secrets) with your real Gemini key.
6. Deploy — Render will run the build and start the Node server.

Notes:
- The `render.yaml` file at the repo root provides a deploy manifest you can import into Render to configure automatic deploys.
- If you only want static hosting (frontend only), use Netlify or Vercel and publish the `dist/` directory after `vite build`.
