import { Routes, Route } from "react-router-dom";
import PrivateRoute from "@/components/auth/PrivateRoute";
import OpenRoute from "@/components/auth/OpenRoute";
import MainNavbar from "@/components/common/MainNavbar";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Individual from "@/components/talk/Individual";
import Group from "@/components/talk/Group";
import Error from "@/pages/Error";
import Talk from "@/pages/Talk";
import Welcome from "@/components/talk/Welcome";
import SocketProvider from "@/context/SocketContext";
import { useRef } from "react";
import useScrollOnTop from "@/hooks/useScrollOnTop";

function App() {
  const pageRenderDivRef = useRef<HTMLDivElement>(null);
  useScrollOnTop(pageRenderDivRef);
  return (
    <div className="w-screen h-screen overflow-y-auto overflow-x-hidden max-w-maxContent min-w-minContent">
      {/* main nav bar */}
      <MainNavbar />

      {/* all pages will be rendered below */}
      <div
        ref={pageRenderDivRef}
        className="w-screen h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden max-w-maxContent min-w-minContent"
      >
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Home />} />

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
            <Route path="/talk/chat/:chatId?" element={<Individual />} />
            <Route path="/talk/group/:groupId?" element={<Group />} />
          </Route>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
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
