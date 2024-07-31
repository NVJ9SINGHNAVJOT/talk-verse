import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useAppSelector } from "@/redux/store";
import { Coordinates } from "@/types/common";
import { SoAddedInGroup } from "@/types/socket/eventTypes";
import { useRef, useState } from "react";
import { CiCircleMinus, CiCirclePlus, CiImageOn } from "react-icons/ci";
import { RxAvatar } from "react-icons/rx";

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
          <div className="w-9/12 h-full flex flex-col justify-center items-center gap-y-12">
            <div className="flex justify-center items-center gap-x-8">
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
            <div className=" max-w-96 flex-wrap flex justify-center items-center gap-6 overflow-y-auto">
              {friends.map((friend, index) => {
                return (
                  <div key={index} className="flex w-fit items-center gap-x-3 rounded-lg bg-black px-3 py-1 text-white">
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
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupContextMenu;
