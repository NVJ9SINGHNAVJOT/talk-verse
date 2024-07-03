import { useNavigate, Outlet } from "react-router-dom";
import MainNavbar from "@/components/common/MainNavbar";
import { useEffect, useRef, useState } from "react";
import useScrollOnTop from "@/hooks/useScrollOnTop";
import { checkUserApi } from "@/services/operations/authApi";
import { setProfile, setUser } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/slices/authSlice";
import SiteLoadingModal from "@/components/common/SiteLoadingModal";
import { useAppSelector } from "@/redux/store";
import { setMyId, setMyPrivateKey } from "@/redux/slices/messagesSlice";
import SocketProvider from "@/context/SocketContext";

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
        dispatch(setMyId(undefined));
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
        dispatch(setMyId(response.user._id));
      } else {
        // for multiple tabs set CHECK_USER_IN_MULTI_TAB to "false"
        localStorage.setItem(process.env.CHECK_USER_IN_MULTI_TAB as string, JSON.stringify("false"));
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
    <SocketProvider>
      {/* wrapper */}
      <div className="h-screen w-screen min-w-minContent bg-black">
        {/* ===== main nav bar ===== */}
        <MainNavbar />

        {/* ===== all pages will be rendered below ===== */}
        <main
          ref={pageRenderDivRef}
          className="mx-auto h-[calc(100vh-4rem)] w-full min-w-minContent max-w-maxContent overflow-y-auto overflow-x-hidden scroll-smooth"
        >
          <Outlet />
        </main>
      </div>
    </SocketProvider>
  );
}

export default App;
