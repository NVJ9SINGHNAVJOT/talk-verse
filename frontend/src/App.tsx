import { Routes, Route, useNavigate } from "react-router-dom";
import PrivateRoute from "@/components/auth/PrivateRoute";
import OpenRoute from "@/components/auth/OpenRoute";
import MainNavbar from "@/components/common/MainNavbar";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Chat from "@/components/core/talk/Chat";
import Group from "@/components/core/talk/Group";
import Error from "@/pages/Error";
import Talk from "@/pages/Talk";
import Welcome from "@/components/core/talk/Welcome";
import SocketProvider from "@/context/SocketContext";
import { useEffect, useRef, useState } from "react";
import useScrollOnTop from "@/hooks/useScrollOnTop";
import { checkUserApi } from "@/services/operations/authApi";
import { setProfile, setUser } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/slices/authSlice";
import SiteLoadingModal from "@/components/common/SiteLoadingModal";
import Profile from "@/pages/Profile";
import Settings from "@/components/core/profile/Settings";
import UserInfo from "@/components/core/profile/UserInfo";
import ChekKey from "@/pages/ChekKey";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import Trending from "@/components/core/blog/Trending";
import Recent from "@/components/core/blog/Recent";
import Category from "@/components/core/blog/Category";
import MyPosts from "@/components/core/profile/MyPosts";
import Following from "@/components/core/profile/Following";
import Followers from "@/components/core/profile/Followers";
import SavedPosts from "@/components/core/profile/SavedPosts";
import { useAppSelector } from "./redux/store";
import { setMyPrivateKey } from "./redux/slices/messagesSlice";

function App() {
  const authUser = useAppSelector((state) => state.auth.authUser);
  const pageRenderDivRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const [checkUser, setCheckUser] = useState<boolean>(true);
  const navigate = useNavigate();

  useScrollOnTop(pageRenderDivRef);

  useEffect(() => {
    // function to check user login status for multiple tabs
    const checkUserLoggedIn = () => {
      const isMultiTabLoggedIn = localStorage.getItem(process.env.CHECK_USER_IN_MULTI_TAB as string);

      if (isMultiTabLoggedIn && authUser && JSON.parse(isMultiTabLoggedIn) === "false") {
        dispatch(setAuthUser(false));
        navigate("/login");
        dispatch(setProfile(null));
        dispatch(setUser(null));
        dispatch(setMyPrivateKey(undefined));
      }
    };

    // event listeners for focus, to check user is still logged in
    window.addEventListener("focus", checkUserLoggedIn);

    return () => {
      window.removeEventListener("focus", checkUserLoggedIn);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  useEffect(() => {
    const checkDefaultLogin = async () => {
      const response = await checkUserApi();

      if (response && response.success === true) {
        dispatch(setUser(response.user));
        dispatch(setAuthUser(true));
      }

      setTimeout(() => {
        setCheckUser(false);
      }, 500);
    };

    checkDefaultLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return checkUser ? (
    <SiteLoadingModal />
  ) : (
    <div className="h-screen w-screen min-w-minContent max-w-maxContent overflow-y-auto overflow-x-hidden">
      {/* ===== main nav bar ===== */}
      <MainNavbar />

      {/* ===== all pages will be rendered below ===== */}
      <div
        ref={pageRenderDivRef}
        className="h-[calc(100vh-4rem)] w-screen min-w-minContent max-w-maxContent overflow-y-auto overflow-x-hidden scroll-smooth"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* ===== open routes ===== */}
          <Route
            path="/login"
            element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            }
          />

          {/* ===== private routes ===== */}
          {/* talk page */}
          <Route
            path="/talk"
            element={
              <PrivateRoute>
                <SocketProvider>
                  <Talk />
                </SocketProvider>
              </PrivateRoute>
            }
          >
            <Route path="/talk" element={<Welcome />} />
            <Route path="/talk/chat/:chatId?" element={<Chat />} />
            <Route path="/talk/group/:groupId?" element={<Group />} />
          </Route>
          {/* profile page */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          >
            <Route path="/profile" element={<UserInfo />} />
            <Route path="/profile/settings" element={<Settings />} />
            <Route path="/profile/myposts" element={<MyPosts />} />
            <Route path="/profile/following" element={<Following />} />
            <Route path="/profile/followers" element={<Followers />} />
            <Route path="/profile/saved" element={<SavedPosts />} />
          </Route>
          {/* checkkey page */}
          <Route
            path="/checkKey"
            element={
              <PrivateRoute>
                <ChekKey />
              </PrivateRoute>
            }
          />
          {/* blog page */}
          <Route
            path="/blog"
            element={
              <PrivateRoute>
                <Blog />
              </PrivateRoute>
            }
          >
            <Route path="/blog" element={<Trending />} />
            <Route path="/blog/recent" element={<Recent />} />
            <Route path="/blog/:category?" element={<Category />} />
          </Route>

          {/* ===== error routes ===== */}
          <Route path="/error" element={<Error />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
