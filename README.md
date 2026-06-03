

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
