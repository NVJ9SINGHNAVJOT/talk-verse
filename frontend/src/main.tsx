import ReactDOM from "react-dom/client";
import App from "@/App.tsx";
import "@/index.css";
import { BrowserRouter } from "react-router-dom";
import store from "@/redux/store.ts";
import { Provider } from "react-redux";
import consoleConfig from "@/config/console.ts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

consoleConfig(process.env.REACT_APP_ENVIRONMENT as string);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <ToastContainer />
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>
);
