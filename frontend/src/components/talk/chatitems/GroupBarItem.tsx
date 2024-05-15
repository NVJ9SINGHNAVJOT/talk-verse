import { setMainGroupId } from "@/redux/slices/messagesSlice";
import { useAppSelector } from "@/redux/store";
import { SoAddedInGroup } from "@/types/socket/eventTypes";
import { CiImageOn } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export type GroupBarItemsProps = {
  group: SoAddedInGroup;
  inChat: string;
  setInChat: React.Dispatch<React.SetStateAction<string>>;
};

const GroupBarItem = (props: GroupBarItemsProps) => {
  const group = props.group;
  const unseenMessages = useAppSelector(
    (state) => state.messages.unseenMessages
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const goToGroup = () => {
    props.setInChat(group._id);
    dispatch(setMainGroupId(group._id));
    navigate(`/talk/group/${group._id}`);
  };

  return (
    <div
      onClick={() => goToGroup()}
      className={` ${
        props.inChat === group._id ? "bg-[#21262C]" : "hover:bg-[#21262C]"
      }
      relative w-full h-[3.8rem] flex justify-between items-center px-4 cursor-pointer
      transition-all duration-100 ease-in-out delay-0`}
    >
      <div className="flex items-center">
        {group.gpImageUrl ? (
          <img
            src={group.gpImageUrl}
            alt="Loading..."
            className=" size-11 aspect-square rounded-2xl ring-2 ring-slate-400"
          />
        ) : (
          <CiImageOn className="  size-11 aspect-square text-white rounded-full  ring-2 ring-slate-400" />
        )}
        <p className=" pl-4 text-white text-[1rem] pb-2">{group.groupName}</p>
      </div>
      <div className=" flex gap-x-2 justify-center items-center">
        <div
          className={`${
            unseenMessages[group._id] === 0
              ? " bg-transparent "
              : "bg-orange-500"
          } rounded-full text-white w-7 h-7 text-center`}
        >
          {unseenMessages[group._id] === 0 ? "" : unseenMessages[group._id]}
        </div>
        <div className="bg-transparent rounded-full  size-3"></div>
      </div>
    </div>
  );
};

export default GroupBarItem;
