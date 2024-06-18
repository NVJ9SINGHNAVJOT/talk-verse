import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useRef } from "react";

type SideMenuProps = {
  menuRefExclude: React.RefObject<HTMLDivElement>;
  setMenu: React.Dispatch<React.SetStateAction<boolean>>;
  homeHandler: () => void;
  aboutHandler: () => void;
  contactHandler: () => void;
  talkHandler: () => void;
  blogHandler: () => void;
};

const SideMenu = (props: SideMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(menuRef, () => props.setMenu(false), props.menuRefExclude);

  return (
    <div
      ref={menuRef}
      className=" bg-richblack-900 text-white bg-opacity-70 flex flex-col z-[1000] md:hidden absolute top-[4rem] right-0 backdrop-blur-md
      justify-start h-[calc(100vh-4rem)] items-center w-4/12 gap-y-4"
    >
      <div
        className="cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed] 
      mt-4 "
        onClick={props.homeHandler}
      >
        Home
      </div>
      <div className="cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed]" onClick={props.aboutHandler}>
        About
      </div>
      <div
        className="cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed]"
        onClick={props.contactHandler}
      >
        Contact
      </div>
      <div className="cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed]" onClick={props.talkHandler}>
        Talk
      </div>
      <div className="cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed]" onClick={props.blogHandler}>
        Blog
      </div>
    </div>
  );
};

export default SideMenu;
