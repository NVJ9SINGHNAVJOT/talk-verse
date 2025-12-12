import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    // vite config
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      "process.env.REACT_APP_ENVIRONMENT": JSON.stringify(env.REACT_APP_ENVIRONMENT),
      "process.env.GROUP_IV": JSON.stringify(env.GROUP_IV),
      "process.env.GROUP_KEY": JSON.stringify(env.GROUP_KEY),
      "process.env.TEST_P_KEY": JSON.stringify(env.TEST_P_KEY),
      "process.env.ERROR_MESSAGE": JSON.stringify(env.ERROR_MESSAGE),
      "process.env.CHECK_USER_IN_MULTI_TAB": JSON.stringify(env.CHECK_USER_IN_MULTI_TAB),
      "process.env.SERVER_KEY": JSON.stringify(env.SERVER_KEY),
      "process.env.REACT_APP_BASE_URL_SOCKET_IO_SERVER": JSON.stringify(env.REACT_APP_BASE_URL_SOCKET_IO_SERVER),
      "process.env.REACT_APP_BASE_URL_SERVER": JSON.stringify(env.REACT_APP_BASE_URL_SERVER),
    },
  };
});
