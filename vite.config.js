import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: set this to your repo name for GitHub Pages, e.g. '/draft-tracker/'
// If you're deploying to a user/org page (username.github.io), set base to '/'
export default defineConfig({
  plugins: [react()],
  base: '/draft-tracker/',
})
