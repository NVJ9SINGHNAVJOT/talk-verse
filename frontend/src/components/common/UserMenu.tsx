import { useAppSelector } from "@/redux/store";
import { useEffect, useRef, useState } from "react";
import DropDownUserMenu from "@/components/common/DropDownUserMenu";
import { useSocketContext } from "@/context/SocketContext";

const UserMenu = () => {
  const user = useAppSelector((state) => state.user.user);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { disconnectSocket } = useSocketContext();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={userMenuRef} className="relative flex items-center justify-evenly">
      {user?.imageUrl ? (
        <img
          onClick={toggleMenu}
          className="aspect-auto size-10 object-cover cursor-pointer rounded"
          src={user?.imageUrl as string}
          alt="Loading..."
        ></img>
      ) : (
        <div
          onClick={toggleMenu}
          className="peer flex size-10 cursor-pointer items-center justify-center gap-1 rounded bg-richblue-500 text-white hover:bg-transparent"
        >
          <span className="text-xl uppercase text-white">{user?.firstName.charAt(0)}</span>
          <span className="text-xl uppercase text-white">{user?.lastName.charAt(0)}</span>
        </div>
      )}
      {/* drop down menu */}
      {menuOpen && <DropDownUserMenu userMenuRef={userMenuRef} setMenuOpen={setMenuOpen} />}
    </div>
  );
};

export default UserMenu;
