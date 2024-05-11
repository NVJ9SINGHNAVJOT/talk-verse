import { IoSearchOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { FaRegBell } from "react-icons/fa";
import FriendBarItem from "@/components/talk/chatItems/FriendBarItems";
import SearchModal from "@/components/talk/chatItems/SearchModal";
import CreateGroup from "@/components/talk/chatItems/CreateGroupModal";
import { useSocketContext } from "@/context/SocketContext";
import userChatBarEvents from "@/socket/events/userChatBarEvents";
import { useEffect, useRef, useState } from "react";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useAppSelector } from "@/redux/store";
import { acceptRequestApi } from "@/services/operations/notificationApi";
import { RxAvatar } from "react-icons/rx";
import { CiCirclePlus } from "react-icons/ci";
import {
  addChatBarData,
  addFriend,
  addNewUnseen,
  ChatBarData,
  deleteUserRequest,
  Friend,
  resetTyping,
  setChatBarData,
  setFriends,
  setGroups,
  setOnlineFriend,
} from "@/redux/slices/chatSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import GroupBarItem from "@/components/talk/chatItems/GroupBarItem";

const UserChatBar = () => {
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
      dispatch(addFriend(newData));
      dispatch(addNewUnseen(response.newChatId));
      dispatch(addChatBarData(newData));
      toast.success("New friend added");
    } else {
      toast.error("Error while adding friend");
    }
  };

  const toggleSearchModal = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggelCreateGroupModal = () => {
    setIsCreateGroupOpen(!isCreateGroupOpen);
  };

  useEffect(() => {
    return () => {
      dispatch(setChatBarData([]));
      dispatch(setFriends([]));
      dispatch(setGroups([]));
      dispatch(setOnlineFriend([]));
      dispatch(resetTyping());
    };
  }, []);

  return (
    <div className="w-full h-full bg-[#0D1117]">
      {/* chat top bar */}
      <div
        className="w-full h-[4rem] flex justify-around items-center py-2 border-b-[1px]
         border-b-whitesmoke border-r-[3px] border-r-black "
      >
        <IoSearchOutline
          onClick={toggleSearchModal}
          className=" text-white text-2xl cursor-pointer"
        />
        <FiPlus
          onClick={toggelCreateGroupModal}
          className=" text-white text-2xl cursor-pointer"
        />
        <div className=" relative">
          <div ref={excSeeNotifRef}>
            <FaRegBell
              className={` ${
                userRequests.length === 0 ? "text-white" : "text-yellow-400 "
              } text-2xl cursor-pointer`}
              onClick={() => setSeeNotif((prev) => !prev)}
            />
          </div>
          {seeNotif && (
            <div
              ref={seeNotifRef}
              className=" absolute z-[500] -top-3 -right-[18rem] rounded-xl gap-y-3 text-white flex flex-col px-5 py-2 bg-black"
            >
              {userRequests?.length === 0 ? (
                <div className=" bg-black px-3 py-1 text-white text-center w-[12rem]">
                  No Requests
                </div>
              ) : (
                userRequests?.map((user, index) => {
                  return (
                    <div
                      key={index}
                      className=" flex w-fit items-center gap-x-3 bg-black hover:bg-gray-800 px-3 py-1 rounded-lg"
                    >
                      {user.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          className=" rounded-full w-10 h-10 aspect-auto"
                          alt="Loading..."
                        />
                      ) : (
                        <RxAvatar className="w-10 h-10 aspect-auto" />
                      )}
                      <div>{user.userName}</div>
                      <CiCirclePlus
                        onClick={() => acceptReq(user._id)}
                        className=" text-white w-8 h-8 aspect-auto cursor-pointer hover:bg-white hover:text-black rounded-full"
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
        {chatBarData?.map((data, index) => {
          if (data.chatId) {
            return (
              <div key={index}>
                <FriendBarItem friend={data as Friend} />
              </div>
            );
          } else {
            return (
              <div key={index}>
                <GroupBarItem />
              </div>
            );
          }
        })}
      </div>

      {/* modals for search user and create group */}
      {isSearchOpen && <SearchModal toggleSearchModal={toggleSearchModal} />}
      {isCreateGroupOpen && (
        <CreateGroup toggelCreateGroupModal={toggelCreateGroupModal} />
      )}
    </div>
  );
};

export default UserChatBar;
