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
      className="absolute right-0 top-[4rem] z-[1000] flex h-[calc(100vh-4rem)] w-4/12 flex-col items-center justify-start gap-y-4 
      bg-richblack-900 bg-opacity-70 text-white backdrop-blur-md [box-shadow:-63px_0px_132px_12px_rgba(0,0,0,0.75)] md:hidden"
    >
      <div
        className="round mt-4 cursor-pointer rounded-sm hover:[text-shadow:0_0_5px_#59deed]"
        onClick={props.homeHandler}
      >
        Home
      </div>
      <div className="round cursor-pointer rounded-sm hover:[text-shadow:0_0_5px_#59deed]" onClick={props.aboutHandler}>
        About
      </div>
      <div
        className="round cursor-pointer rounded-sm hover:[text-shadow:0_0_5px_#59deed]"
        onClick={props.contactHandler}
      >
        Contact
      </div>
      <div className="round cursor-pointer rounded-sm hover:[text-shadow:0_0_5px_#59deed]" onClick={props.talkHandler}>
        Talk
      </div>
      <div className="round cursor-pointer rounded-sm hover:[text-shadow:0_0_5px_#59deed]" onClick={props.blogHandler}>
        Blog
      </div>
    </div>
  );
};

export default SideMenu;
