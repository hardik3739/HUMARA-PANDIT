<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/62e98110-e17d-4f25-9f7b-6b9e740c227d

## Run Locally

**Prerequisites:** Node.js, Java 17+, Maven


1. Install dependencies:
   `npm install`
2. Start the Spring Boot backend:
   `npm run dev:backend`
3. In a second terminal, run the frontend:
   `npm run dev`

The React app runs through Vite and proxies `/api` requests to the Spring Boot service on `http://localhost:8080`.

If `npm run ...` is unavailable on your machine, use the direct commands:

- Backend: `mvn -f backend/pom.xml spring-boot:run`
- Frontend: `node node_modules/vite/bin/vite.js --host 0.0.0.0`
