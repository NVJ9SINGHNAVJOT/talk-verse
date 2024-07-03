import ReactDOM from "react-dom/client";
import store from "@/redux/store.ts";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import App from "@/App.tsx";
import "@/index.css";
import OpenRoute from "@/components/auth/OpenRoute";
import PrivateRoute from "@/components/auth/PrivateRoute";
import Category from "@/components/core/blog/Category";
import Recent from "@/components/core/blog/Recent";
import Trending from "@/components/core/blog/Trending";
import Followers from "@/components/core/profile/Followers";
import Following from "@/components/core/profile/Following";
import MyPosts from "@/components/core/profile/MyPosts";
import SavedPosts from "@/components/core/profile/SavedPosts";
import Settings from "@/components/core/profile/Settings";
import UserInfo from "@/components/core/profile/UserInfo";
import Chat from "@/components/core/talk/Chat";
import Welcome from "@/components/core/talk/Welcome";
import About from "@/pages/About";
import Blog from "@/pages/Blog";
import ChekKey from "@/pages/ChekKey";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Talk from "@/pages/Talk";
import Home from "@/pages/Home";
import Group from "@/components/core/talk/Group";
import Error from "@/pages/Error";
import ResetPassword from "@/pages/ResetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      /* ===== open routes ===== */
      {
        path: "login",
        element: (
          <OpenRoute>
            <Login />
          </OpenRoute>
        ),
      },
      {
        path: "resetPassword",
        element: (
          <OpenRoute>
            <ResetPassword />
          </OpenRoute>
        ),
      },
      /* ===== private routes ===== */
      {
        path: "talk",
        element: (
          <PrivateRoute>
            <Talk />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <Welcome />,
          },
          {
            path: "chat/:chatId",
            element: <Chat />,
          },
          {
            path: "group/:groupId",
            element: <Group />,
          },
        ],
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <UserInfo />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
          {
            path: "myposts",
            element: <MyPosts />,
          },
          {
            path: "following",
            element: <Following />,
          },
          {
            path: "followers",
            element: <Followers />,
          },
          {
            path: "saved",
            element: <SavedPosts />,
          },
        ],
      },
      {
        path: "checkKey",
        element: (
          <PrivateRoute>
            <ChekKey />
          </PrivateRoute>
        ),
      },
      {
        path: "blog",
        element: (
          <PrivateRoute>
            <Blog />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <Trending />,
          },
          {
            path: "recent",
            element: <Recent />,
          },
          {
            path: ":category",
            element: <Category />,
          },
        ],
      },
      /* ===== error route ===== */
      {
        path: "error",
        element: <Error />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="error" />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
    <ToastContainer />
  </Provider>
);
