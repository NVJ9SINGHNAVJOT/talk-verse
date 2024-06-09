import { setAuthUser } from "@/redux/slices/authSlice";
import { setMyPrivateKey } from "@/redux/slices/messagesSlice";
import { setProfile, setUser } from "@/redux/slices/userSlice";
import { logOutApi } from "@/services/operations/authApi";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type LogOutModalPros = {
  setTogLogO: React.Dispatch<React.SetStateAction<boolean>>;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const LogOutModal = (props: LogOutModalPros) => {
  const [logginOut, setLoggingOut] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logOut = async () => {
    setLoggingOut(true);

    const response = await logOutApi();
    if (!response) {
      toast.error("Error while logging out");
    } else {
      toast.success("Logged Out");
    }

    // clean up for log out
    dispatch(setProfile(null));
    dispatch(setUser(null));
    dispatch(setAuthUser(false));
    dispatch(setMyPrivateKey(undefined));

    props.setMenuOpen(false);
    navigate("/");
  };

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 flex justify-center items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      {logginOut ? (
        <span
          className="shinningLogOutTitle text-4xl cursor-pointer rounded-2xl
         border border-gray-800 bg-[linear-gradient(110deg,#000,45%,#4D4B4B,55%,#000)] bg-[length:250%_100%]
          px-16 py-4 font-medium text-gray-300"
        >
          Logging Out...
        </span>
      ) : (
        <div className=" flex gap-10">
          <button
            disabled={logginOut}
            onClick={() => {
              logOut();
            }}
            className="text-white bg-black h-[3rem] w-fit px-4 rounded-md"
          >
            Log Out
          </button>
          <button
            onClick={() => {
              props.setTogLogO(false);
            }}
            className="relative inline-flex h-[3rem] w-fit items-center justify-center rounded-md
          bg-white px-4 font-medium text-gray-950 transition-colors"
          >
            <div
              className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe]
            to-[#8678f9] opacity-75 blur"
            />
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default LogOutModal;
