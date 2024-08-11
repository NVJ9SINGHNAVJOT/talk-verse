import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useAppSelector } from "@/redux/store";
import { getGroupMembersApi } from "@/services/operations/chatApi";
import { addFriendInGroupApi } from "@/services/operations/notificationApi";
import { Coordinates } from "@/types/common";
import { SoAddedInGroup } from "@/types/socket/eventTypes";
import { useEffect, useRef, useState } from "react";
import { CiCircleMinus, CiCirclePlus, CiImageOn } from "react-icons/ci";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import { toast } from "react-toastify";

type GroupContextMenuProps = {
  group: SoAddedInGroup;
  coordinates: Coordinates;
  setMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

const GroupContextMenu = (props: GroupContextMenuProps) => {
  const friends = useAppSelector((state) => state.chat.friends);
  const groupMenuDiv = useRef<HTMLDivElement>(null);
  const modalDivRef = useRef<HTMLDivElement>(null);
  const [addMemberModal, setAddMemberModal] = useState<boolean>(false);
  const [members, setMembers] = useState<string[]>([]);
  const [membersAvailable, setMembersAvailable] = useState<boolean>(false);
  const [newGroupMembers, setNewGroupMembers] = useState<string[]>([]);

  useOnClickOutside(groupMenuDiv, () => props.setMenu(false), modalDivRef);

  const openModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setAddMemberModal(true);
  };

  const addMember = (_id: string) => {
    if (newGroupMembers.includes(_id)) {
      setNewGroupMembers((prev) => prev.filter((userId) => userId !== _id));
    } else {
      setNewGroupMembers((prev) => [...prev, _id]);
    }
  };

  const addFriendsInGroup = async () => {
    props.setMenu(false);

    const tid = toast.loading("Adding friends");
    const response = await addFriendInGroupApi(props.group._id, newGroupMembers);
    toast.dismiss(tid);

    if (response) {
      toast.success("Friends added in group");
      return;
    }
    toast.error("Error while adding friends in group");
  };

  useEffect(() => {
    const getMembers = async () => {
      const response = await getGroupMembersApi(props.group._id);
      if (!response) {
        toast.error("Error while getting group members");
        props.setMenu(false);
        return;
      }
      setMembersAvailable(friends.some((friend) => !response.members.includes(friend._id)));
      setMembers(response.members);
    };
    getMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="absolute z-50" style={{ left: props.coordinates.xDistance, top: props.coordinates.yDistance }}>
      <div
        onClick={(e) => openModal(e)}
        ref={groupMenuDiv}
        className={`text-xs w-fit text-nowrap bg-snow-100 px-2 py-2  
      text-black font-be-veitnam-pro rounded-lg`}
      >
        Add Member
      </div>
      {/* add members modal */}
      {addMemberModal && (
        <div
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          ref={modalDivRef}
          className="fixed inset-0 z-[1000] h-screen w-screen max-w-maxContent flex items-center justify-center overflow-y-auto 
          bg-transparent backdrop-blur-[4px] cursor-default"
        >
          <div className="w-9/12 h-full flex flex-col items-center gap-y-12">
            <div className="relative mt-56 flex justify-center items-center gap-x-8">
              <button
                disabled={newGroupMembers.length === 0}
                onClick={addFriendsInGroup}
                className={`${newGroupMembers.length === 0 && "hidden"} absolute inline-flex h-[3rem] w-fit 
                  items-center justify-center rounded-md bg-white 
                px-4 font-medium text-gray-950 transition-colors -top-20 `}
              >
                <div
                  className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe] to-[#8678f9] 
                  opacity-75 blur"
                />
                Add
              </button>
              <MdOutlineCancelPresentation
                onClick={() => props.setMenu(false)}
                className="absolute -top-32 -right-36 h-8 w-11 cursor-pointer self-end fill-white hover:fill-slate-300"
              />
              <div className="text-2xl text-white">{props.group.groupName}</div>
              {props.group.gpImageUrl ? (
                <img
                  src={props.group.gpImageUrl}
                  className="block size-11 rounded bg-richblack-300 object-cover"
                  alt="Avatar"
                />
              ) : (
                <CiImageOn className="block size-11 rounded bg-richblack-300" />
              )}
            </div>
            {members.length === 0 ? (
              <div className=" font-semibold text-white text-3xl animate-pulse">Getting Members</div>
            ) : membersAvailable === false ? (
              <div className=" text-white font-be-veitnam-pro">Your all friends are already in this group</div>
            ) : (
              <div className=" max-w-96 flex-wrap flex justify-center items-center gap-6 max-h-[calc(100vh-60vh)] overflow-y-auto">
                {members.length !== 0 &&
                  friends.map((friend, index) => {
                    if (!members.includes(friend._id)) {
                      return (
                        <div
                          key={index}
                          className="flex w-fit items-center gap-x-3 rounded-lg bg-black px-3 py-1 text-white"
                        >
                          {friend.imageUrl ? (
                            <img src={friend.imageUrl} className="aspect-auto size-8 rounded-full" alt="Loading..." />
                          ) : (
                            <RxAvatar className="aspect-auto size-8" />
                          )}
                          <div className="flex items-center justify-center gap-x-2 text-xs text-white">
                            <div>{friend.firstName}</div>
                            <div>{friend.lastName}</div>
                          </div>
                          {newGroupMembers.includes(friend._id) ? (
                            <CiCircleMinus
                              onClick={() => addMember(friend._id)}
                              className="aspect-auto size-6 cursor-pointer rounded-full bg-white text-black"
                            />
                          ) : (
                            <CiCirclePlus
                              onClick={() => addMember(friend._id)}
                              className="aspect-auto size-6 cursor-pointer rounded-full text-white hover:bg-white hover:text-black"
                            />
                          )}
                        </div>
                      );
                    }
                  })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupContextMenu;
