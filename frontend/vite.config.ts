import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    // vite config
    plugins: [react(), tsconfigPaths()],
    define: {
      "process.env.REACT_APP_ENVIRONMENT": JSON.stringify(env.REACT_APP_ENVIRONMENT),
      "process.env.GROUP_IV": JSON.stringify(env.GROUP_IV),
      "process.env.GROUP_KEY": JSON.stringify(env.GROUP_KEY),
      "process.env.TEST_P_KEY": JSON.stringify(env.TEST_P_KEY),
      "process.env.ERROR_MESSAGE": JSON.stringify(env.ERROR_MESSAGE),
      "process.env.SERVER_KEY": JSON.stringify(env.SERVER_KEY),
      "process.env.REACT_APP_BASE_URL_SOCKET_IO_SERVER": JSON.stringify(env.REACT_APP_BASE_URL_SOCKET_IO_SERVER),
      "process.env.REACT_APP_BASE_URL_SERVER": JSON.stringify(env.REACT_APP_BASE_URL_SERVER),
    },
    server: {
      open: true,
    },
  };
});
