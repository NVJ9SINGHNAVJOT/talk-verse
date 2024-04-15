import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  define: {
    "process.env.REACT_APP_BASE_URL_SERVER1": JSON.stringify(process.env.REACT_APP_BASE_URL_SERVER1),
  },
  server: {
    open: true,
  },
});
