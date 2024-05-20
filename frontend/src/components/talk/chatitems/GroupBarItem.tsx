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
      relative w-full h-[3.8rem] flex justify-between items-center sm:px-2 lg:px-4 cursor-pointer
      transition-all duration-100 ease-in-out delay-0`}
    >
      <div className="flex items-center">
        {group.gpImageUrl ? (
          <img
            src={group.gpImageUrl}
            alt="Loading..."
            className="  sm:size-8 lg:size-11 aspect-square rounded-2xl ring-1 ring-slate-400"
          />
        ) : (
          <CiImageOn className="  sm:size-8 lg:size-11 aspect-square text-white rounded-full  ring-1 ring-slate-400" />
        )}
        <p className=" pl-4 text-white sm:text-[0.9rem] lg:text-[1rem] pb-2 truncate">
          {group.groupName}
        </p>
      </div>
      <div className=" flex gap-x-2 justify-center items-center">
        <div
          className={`${
            unseenMessages[group._id] === 0
              ? " bg-transparent "
              : "bg-orange-500"
          } rounded-full text-white sm:size-6 lg:size-7 text-center sm:text-sm flex justify-center items-center`}
        >
          <div className=" pb-[0.15rem]">
            {unseenMessages[group._id] === 0 ? "" : unseenMessages[group._id]}
          </div>
        </div>
        <div className="bg-transparent rounded-full  sm:size-2  lg:size-3"></div>
      </div>
    </div>
  );
};

export default GroupBarItem;
