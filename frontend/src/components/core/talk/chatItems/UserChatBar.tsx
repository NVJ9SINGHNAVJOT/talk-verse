import { IoSearchOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { FaRegBell } from "react-icons/fa";
import SearchModal from "@/components/common/SearchModal";
import CreateGroup from "@/components/core/talk/chatItems/CreateGroupModal";
import { useRef, useState } from "react";
import { useAppSelector } from "@/redux/store";
import GroupBarItem from "@/components/core/talk/chatItems/GroupBarItem";
import { type SoAddedInGroup } from "@/types/socket/eventTypes";
import FriendBarItem from "@/components/core/talk/chatItems/FriendBarItem";
import FriendRequests from "@/components/core/talk/chatItems/FriendRequests";
import { type Friend } from "@/redux/slices/chatSlice";

const UserChatBar = () => {
  const [inChat, setInChat] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [seeNotif, setSeeNotif] = useState(false);
  const excSeeNotifRef = useRef<HTMLDivElement>(null);
  const userRequests = useAppSelector((state) => state.chat.userRequests);
  const chatBarData = useAppSelector((state) => state.chat.chatBarData);

  return (
    <div className="h-full w-full bg-[#0D1117]">
      {/* chat top bar */}
      <div
        className="relative flex h-[4rem] w-full items-center justify-around border-b-[1px] border-r-[3px] 
      border-b-whitesmoke border-r-black py-2"
      >
        <IoSearchOutline onClick={() => setIsSearchOpen(true)} className="cursor-pointer text-2xl text-white" />
        <FiPlus onClick={() => setIsCreateGroupOpen(true)} className="cursor-pointer text-2xl text-white" />
        <div ref={excSeeNotifRef}>
          <FaRegBell
            className={` ${userRequests.length === 0 ? "text-white" : "text-yellow-400"} cursor-pointer text-2xl`}
            onClick={() => setSeeNotif((prev) => !prev)}
          />
        </div>
        {seeNotif && <FriendRequests setSeeNotif={setSeeNotif} excSeeNotifRef={excSeeNotifRef} />}
      </div>

      {/* chat user component */}
      <div className="h-[calc(100vh-8rem)] w-full overflow-y-scroll scroll-smooth">
        {chatBarData.length > 0 &&
          chatBarData.map((data, index) => (
            <div key={index}>
              {"chatId" in data ? (
                <FriendBarItem friend={data as Friend} inChat={inChat} setInChat={setInChat} />
              ) : (
                <GroupBarItem group={data as SoAddedInGroup} inChat={inChat} setInChat={setInChat} />
              )}
            </div>
          ))}
      </div>

      {/* modals for search user and create group */}
      {isSearchOpen && <SearchModal setIsSearchOpen={setIsSearchOpen} requestType="friend" />}
      {isCreateGroupOpen && <CreateGroup setIsCreateGroupOpen={setIsCreateGroupOpen} />}
    </div>
  );
};

export default UserChatBar;
