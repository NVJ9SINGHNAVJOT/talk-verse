import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useAppSelector } from "@/redux/store";
import { useRef, useState } from "react";

const UserMenu = () => {
  const user = useAppSelector((state) => state.user.user);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

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
          className="w-10 h-10 rounded aspect-auto"
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
        } gap-1 absolute top-16 -left-[4.4rem] flex flex-col justify-start 
                        z-50 text-white w-28 bg-black py-2 rounded-sm`}
      >
        <div className=" cursor-pointer bg-black hover:bg-grayblack py-1 px-2">
          Profile
        </div>
        <div className=" cursor-pointer bg-black hover:bg-grayblack py-1 px-2">
          Settings
        </div>
        <div className=" cursor-pointer bg-black hover:bg-grayblack py-1 px-2">
          Log Out
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
