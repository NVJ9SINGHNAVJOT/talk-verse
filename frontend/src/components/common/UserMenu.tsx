import { useAppSelector } from "@/redux/store";
import { useRef, useState } from "react";
import DropDownUserMenu from "@/components/common/DropDownUserMenu";

const UserMenu = () => {
  const user = useAppSelector((state) => state.user.user);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  if (!user) {
    return <div>Error</div>;
  }

  return (
    <div ref={userMenuRef} className=" relative flex justify-evenly items-center">
      {user.imageUrl ? (
        <img
          onClick={toggleMenu}
          className="w-10 h-10 rounded aspect-auto cursor-pointer"
          src={user?.imageUrl as string}
          alt="Loading..."
        ></img>
      ) : (
        <div
          onClick={toggleMenu}
          className=" peer bg-richblue-500 text-white w-10 h-10 rounded flex 
                    cursor-pointer justify-center items-center gap-1 hover:bg-transparent"
        >
          <span className=" uppercase text-white text-xl">{user.firstName.charAt(0)}</span>
          <span className=" uppercase text-white text-xl">{user.lastName.charAt(0)}</span>
        </div>
      )}
      {/* drop down menu */}
      {menuOpen && <DropDownUserMenu userMenuRef={userMenuRef} setMenuOpen={setMenuOpen} />}
    </div>
  );
};

export default UserMenu;
