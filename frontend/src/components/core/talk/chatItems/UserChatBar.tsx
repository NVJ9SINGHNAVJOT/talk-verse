import { IoSearchOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { FaRegBell } from "react-icons/fa";
import SearchModal from "@/components/core/talk/chatItems/SearchModal";
import CreateGroup from "@/components/core/talk/chatItems/CreateGroupModal";
import { useSocketContext } from "@/context/SocketContext";
import userChatBarEvents from "@/socket/events/userChatBarEvents";
import { useRef, useState } from "react";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useAppSelector } from "@/redux/store";
import { acceptRequestApi, deleteRequestApi } from "@/services/operations/notificationApi";
import { RxAvatar } from "react-icons/rx";
import { CiCirclePlus } from "react-icons/ci";
import { addChatBarData, addFriend, ChatBarData, deleteUserRequest, Friend } from "@/redux/slices/chatSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import GroupBarItem from "@/components/core/talk/chatItems/GroupBarItem";
import { addNewUnseen, addPublicKey, PublicKey } from "@/redux/slices/messagesSlice";
import { SoAddedInGroup } from "@/types/socket/eventTypes";
import FriendBarItem from "@/components/core/talk/chatItems/FriendBarItem";

const UserChatBar = () => {
  const [inChat, setInChat] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [seeNotif, setSeeNotif] = useState(false);
  const { socket } = useSocketContext();
  const seeNotifRef = useRef<HTMLDivElement>(null);
  const excSeeNotifRef = useRef<HTMLDivElement>(null);
  const userRequests = useAppSelector((state) => state.chat.userRequests);
  const chatBarData = useAppSelector((state) => state.chat.chatBarData);
  useOnClickOutside(seeNotifRef, () => setSeeNotif(false), excSeeNotifRef);
  const dispatch = useDispatch();

  userChatBarEvents(socket);

  const acceptReq = async (userId: string) => {
    dispatch(deleteUserRequest(userId));
    const response = await acceptRequestApi(userId);
    if (response && response.success === true) {
      const newData: Friend & ChatBarData = {
        _id: response.newFriend._id,
        firstName: response.newFriend.firstName,
        lastName: response.newFriend.lastName,
        imageUrl: response.newFriend.imageUrl,
        chatId: response.newChatId,
      };
      dispatch(
        addPublicKey({
          userId: response.newFriend._id,
          publicKey: response.newFriendPublicKey,
        } as PublicKey)
      );
      dispatch(addFriend(newData));
      dispatch(addNewUnseen(response.newChatId));
      dispatch(addChatBarData(newData));
      toast.success("New friend added");
    } else {
      toast.error("Error while adding friend");
    }
  };

  const deleteReq = async (userId: string) => {
    dispatch(deleteUserRequest(userId));
    const response = await deleteRequestApi(userId);
    if (response) {
      toast.info("Request deleted");
    } else {
      toast.error("Error while deleting request");
    }
  };

  const toggleSearchModal = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggelCreateGroupModal = () => {
    setIsCreateGroupOpen(!isCreateGroupOpen);
  };

  return (
    <div className="w-full h-full bg-[#0D1117]">
      {/* chat top bar */}
      <div
        className="w-full h-[4rem] flex justify-around items-center py-2 border-b-[1px]
         border-b-whitesmoke border-r-[3px] border-r-black "
      >
        <IoSearchOutline onClick={toggleSearchModal} className=" text-white text-2xl cursor-pointer" />
        <FiPlus onClick={toggelCreateGroupModal} className=" text-white text-2xl cursor-pointer" />
        <div className=" relative">
          <div ref={excSeeNotifRef}>
            <FaRegBell
              className={` ${userRequests.length === 0 ? "text-white" : "text-yellow-400 "} text-2xl cursor-pointer`}
              onClick={() => setSeeNotif((prev) => !prev)}
            />
          </div>
          {seeNotif && (
            <div
              ref={seeNotifRef}
              className=" absolute z-[500] -top-3 -right-[18rem] rounded-xl gap-y-3 text-white flex flex-col px-5 py-2 bg-black"
            >
              {userRequests?.length === 0 ? (
                <div className=" bg-black px-3 py-1 text-white text-center w-[12rem]">No Requests</div>
              ) : (
                userRequests?.map((user, index) => {
                  return (
                    <div
                      key={index}
                      className=" flex w-fit items-center gap-x-3 bg-black hover:bg-gray-800 px-3 py-1 rounded-lg"
                    >
                      {user.imageUrl ? (
                        <img src={user.imageUrl} className=" rounded-full w-10 h-10 aspect-auto" alt="Loading..." />
                      ) : (
                        <RxAvatar className="w-10 h-10 aspect-auto" />
                      )}
                      <div className=" truncate">{user.userName}</div>
                      <CiCirclePlus
                        onClick={() => acceptReq(user._id)}
                        className=" text-white w-8 h-8 aspect-auto cursor-pointer hover:bg-white hover:text-black rounded-full"
                      />
                      <CiCirclePlus
                        onClick={() => deleteReq(user._id)}
                        className=" text-white w-8 h-8 aspect-auto cursor-pointer rotate-45 hover:bg-white hover:text-black rounded-full"
                      />
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* chat user component */}
      <div className="w-full h-[calc(100vh-8rem)] overflow-y-scroll scroll-smooth">
        {chatBarData?.map((data, index) => (
          <div key={index}>
            {data.chatId !== undefined ? (
              <FriendBarItem friend={data as Friend} inChat={inChat} setInChat={setInChat} />
            ) : (
              <GroupBarItem group={data as SoAddedInGroup} inChat={inChat} setInChat={setInChat} />
            )}
          </div>
        ))}
      </div>

      {/* modals for search user and create group */}
      {isSearchOpen && <SearchModal toggleSearchModal={toggleSearchModal} />}
      {isCreateGroupOpen && <CreateGroup toggelCreateGroupModal={toggelCreateGroupModal} />}
    </div>
  );
};

export default UserChatBar;
