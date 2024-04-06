import { IoSearchOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { FaRegBell } from "react-icons/fa";
import ChatBarItems from "@/components/talk/chatitems/ChatBarItems";
import SearchModal from "@/components/talk/chatitems/SearchModal";
import { useState } from "react";


const UserChatBar = () => {

  const [isOpen, setIsOpen] = useState(false);


  const toggleModal = () => {
    setIsOpen(!isOpen);
  }
  
  return (
    <div className="w-full h-full bg-[#0D1117]">

      {/* chat top bar */}
      <div className="w-full h-[4rem] flex justify-around items-center py-2 border-b-[1px]
         border-b-whitesmoke border-r-[3px] border-r-black ">

        <IoSearchOutline onClick={toggleModal} className=" text-white text-2xl cursor-pointer" />
        <FiPlus className=" text-white text-2xl cursor-pointer" />
        <FaRegBell className=" text-white text-2xl cursor-pointer" />

      </div>

      {/* chat user component */}
      <div className="w-full h-[calc(100vh-8rem)] overflow-y-scroll scroll-smooth">

        <ChatBarItems />

      </div>

      {isOpen && <SearchModal toggleModal = {toggleModal} />}

    </div>
  )
}

export default UserChatBar