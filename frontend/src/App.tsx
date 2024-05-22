import { Routes, Route } from "react-router-dom";
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
import { CheckUserRs } from "@/types/apis/authApiRs";
import { setUser } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/slices/authSlice";
import SiteLoadingModal from "@/components/common/SiteLoadingModal";
import Profile from "@/pages/Profile";
import Dashboard from "@/components/core/profile/Dashboard";
import Settings from "@/components/core/profile/Settings";
import UserInfo from "@/components/core/profile/UserInfo";
import ChekKey from "@/pages/ChekKey";
import Contact from "@/pages/Contact";

function App() {
  const pageRenderDivRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const [checkUser, setCheckUser] = useState<boolean>(true);

  useScrollOnTop(pageRenderDivRef);

  useEffect(() => {
    const checkDefaultLogin = async () => {
      const response: CheckUserRs = await checkUserApi();

      if (response && response.success === true) {
        dispatch(setUser(response.user));
        dispatch(setAuthUser(true));
      }

      setTimeout(() => {
        setCheckUser(false);
      }, 500);
    };

    checkDefaultLogin();
  }, []);

  return checkUser ? (
    <SiteLoadingModal />
  ) : (
    <div className="w-screen h-screen overflow-y-auto overflow-x-hidden max-w-maxContent min-w-minContent">
      {/* main nav bar */}
      <MainNavbar />

      {/* all pages will be rendered below */}
      <div
        ref={pageRenderDivRef}
        className="w-screen h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden max-w-maxContent min-w-minContent"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* open routes */}
          <Route element={<OpenRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* private routes */}
          <Route
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
          <Route
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          >
            <Route path="/profile" element={<UserInfo />} />
            <Route path="/profile/dashboard" element={<Dashboard />} />
            <Route path="/profile/settings" element={<Settings />} />
          </Route>
          <Route
            path="/checkKey"
            element={
              <PrivateRoute>
                <ChekKey />
              </PrivateRoute>
            }
          />

          {/* error routes */}
          <Route path="/error" element={<Error />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
