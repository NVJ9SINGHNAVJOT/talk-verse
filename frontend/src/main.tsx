import ReactDOM from "react-dom/client";
import store from "@/redux/store.ts";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />

      {/* ===== open routes ===== */}
      <Route
        path="login"
        element={
          <OpenRoute>
            <Login />
          </OpenRoute>
        }
      />

      {/* ===== private routes ===== */}
      {/* talk page */}
      <Route
        path="talk"
        element={
          <PrivateRoute>
            <Talk />
          </PrivateRoute>
        }
      >
        <Route index element={<Welcome />} />
        <Route path="chat/:chatId?" element={<Chat />} />
        <Route path="group/:groupId?" element={<Group />} />
      </Route>
      {/* profile page */}
      <Route
        path="profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      >
        <Route index element={<UserInfo />} />
        <Route path="settings" element={<Settings />} />
        <Route path="myposts" element={<MyPosts />} />
        <Route path="following" element={<Following />} />
        <Route path="followers" element={<Followers />} />
        <Route path="saved" element={<SavedPosts />} />
      </Route>
      {/* checkkey page */}
      <Route
        path="checkKey"
        element={
          <PrivateRoute>
            <ChekKey />
          </PrivateRoute>
        }
      />
      {/* blog page */}
      <Route
        path="blog"
        element={
          <PrivateRoute>
            <Blog />
          </PrivateRoute>
        }
      >
        <Route index element={<Trending />} />
        <Route path="recent" element={<Recent />} />
        <Route path=":category?" element={<Category />} />
      </Route>

      {/* ===== error routes ===== */}
      <Route path="error" element={<Error />} />
      <Route path="*" element={<Error />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
    <ToastContainer />
  </Provider>
);
