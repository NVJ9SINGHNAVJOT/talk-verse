import { useAppSelector } from "@/redux/store";
import { type SoAddedInGroup } from "@/types/socket/eventTypes";
import { useRef, useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import GroupContextMenu from "@/components/core/talk/chatItems/GroupContextMenu";
import { type Coordinates } from "@/types/common";
import { messagesSliceObject } from "@/redux/slices/messagesSlice";

export type GroupBarItemsProps = {
  group: SoAddedInGroup;
  inChat: string;
  setInChat: React.Dispatch<React.SetStateAction<string>>;
};

const GroupBarItem = (props: GroupBarItemsProps) => {
  const group = props.group;
  const unseenMessages = useAppSelector((state) => state.messages.unseenMessages);
  const [menu, setMenu] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<Coordinates>({ xDistance: 0, yDistance: 0 });
  const groupDiv = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const goToGroup = () => {
    props.setInChat(group._id);
    messagesSliceObject.mainGroupId = group._id;
    navigate(`/talk/group/${group._id}`);
  };

  const groupContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (!group.isAdmin) {
      return;
    }
    if (groupDiv.current) {
      const rect = groupDiv.current.getBoundingClientRect();
      const x = Math.floor(e.clientX - rect.left);
      setCoordinates({
        xDistance: x < 8 ? 8 : rect.right - e.clientX < 99 ? rect.width - 99 : x,
        yDistance: Math.floor(e.clientY - rect.top),
      });
    }
    if (!menu) {
      setMenu(true);
    }
  };

  return (
    <div
      ref={groupDiv}
      onClick={goToGroup}
      onContextMenu={(e) => groupContextMenu(e)}
      className={`${props.inChat === group._id ? "bg-[#21262C]" : "hover:bg-[#21262C]"}
      relative w-full h-[3.8rem] flex justify-between items-center px-2 lg:px-4 cursor-pointer
      transition-all duration-100 ease-in-out delay-0`}
    >
      {menu && <GroupContextMenu group={group} setMenu={setMenu} coordinates={coordinates} />}
      <div className="flex items-center">
        {group.gpImageUrl ? (
          <img
            src={group.gpImageUrl}
            alt="Loading..."
            className="size-8 lg:size-11 aspect-square rounded-2xl ring-1 ring-slate-400"
          />
        ) : (
          <CiImageOn className="size-8 lg:size-11 aspect-square text-white rounded-full  ring-1 ring-slate-400" />
        )}
        <p className="pl-4 text-white text-[0.9rem] lg:text-[1rem] pb-2 truncate">{group.groupName}</p>
      </div>
      <div className="flex gap-x-2 justify-center items-center">
        <div
          className={`${
            unseenMessages[group._id] === 0 ? " bg-transparent " : "bg-orange-500"
          } rounded-full text-white size-6 lg:size-7 text-center text-sm flex justify-center items-center`}
        >
          <div className=" pb-[0.15rem]">{unseenMessages[group._id] === 0 ? "" : unseenMessages[group._id]}</div>
        </div>
        <div className="opacity-0 size-2 lg:size-3"></div>
      </div>
    </div>
  );
};

export default GroupBarItem;
