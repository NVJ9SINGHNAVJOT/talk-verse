import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useAppSelector } from "@/redux/store";
import { useRef, useState } from "react";
import LogOutModal from "../auth/LogOutModal";

const UserMenu = () => {
  const user = useAppSelector((state) => state.user.user);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [togLogO, setTogLogO] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  useOnClickOutside(userMenuRef, () => setMenuOpen(false));

  if (!user) {
    return <div>Error</div>;
  }

  let first;
  let second;
  if (!user.imageUrl) {
    first = user.firstName.charAt(0);
    second = user.lastName.charAt(0);
  }
  return (
    <div
      ref={userMenuRef}
      className=" relative flex justify-evenly items-center"
    >
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
          <span className=" uppercase text-white text-xl">{first}</span>
          <span className=" uppercase text-white text-xl">{second}</span>
        </div>
      )}
      {/* drop down menu */}
      <div
        className={`${
          menuOpen ? "block" : "hidden"
        } gap-1 absolute top-16 -left-[6rem] flex flex-col justify-start 
          z-[500] text-white w-36 bg-black py-2 rounded-sm`}
      >
        <div className=" cursor-pointer bg-black hover:bg-grayblack py-1 px-6">
          Profile
        </div>
        <div className=" cursor-pointer bg-black hover:bg-grayblack py-1 px-6">
          Settings
        </div>
        <div
          onClick={() => {
            setTogLogO(true);
          }}
          className=" cursor-pointer bg-black hover:bg-grayblack py-1 px-6"
        >
          Log Out
        </div>
      </div>
      {togLogO && <LogOutModal setTogLogO={setTogLogO} />}
    </div>
  );
};

export default UserMenu;
