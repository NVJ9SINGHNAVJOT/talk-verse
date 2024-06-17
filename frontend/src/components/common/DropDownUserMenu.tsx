import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import LogOutModal from "@/components/auth/LogOutModal";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type DropDownUserMenuProps = {
  userMenuRef: React.RefObject<HTMLDivElement>;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DropDownUserMenu = (props: DropDownUserMenuProps) => {
  const navigate = useNavigate();
  const [togLogO, setTogLogO] = useState<boolean>(false);

  useOnClickOutside(props.userMenuRef, () => props.setMenuOpen(false));

  return (
    <div
      className="gap-1 absolute top-16 -left-[6rem] flex flex-col justify-start 
    z-[500] text-white w-36 bg-black py-2 rounded-sm"
    >
      <div
        onClick={() => {
          props.setMenuOpen(false);
          navigate("/profile");
        }}
        className=" cursor-pointer bg-black hover:bg-grayblack py-1 px-6"
      >
        Profile
      </div>
      <div
        onClick={() => {
          props.setMenuOpen(false);
          navigate("/profile/settings");
        }}
        className=" cursor-pointer bg-black hover:bg-grayblack py-1 px-6"
      >
        Settings
      </div>
      <div
        onClick={() => {
          props.setMenuOpen(false);
          setTogLogO(true);
        }}
        className=" cursor-pointer bg-black hover:bg-grayblack py-1 px-6"
      >
        Log Out
      </div>
      {togLogO && <LogOutModal setTogLogO={setTogLogO} setMenuOpen={props.setMenuOpen} />}
    </div>
  );
};

export default DropDownUserMenu;
