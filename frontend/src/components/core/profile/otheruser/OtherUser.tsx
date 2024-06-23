import { unfollowUserApi } from "@/services/operations/profileApi";
import { UserSuggestion } from "@/types/apis/notificationApiRs";
import { useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { toast } from "react-toastify";

type OtherUserProps = {
  otherUser: UserSuggestion & { createdAt: string };
  // eslint-disable-next-line no-unused-vars
  removeOtherUser: (otherUserId: number) => void;
};

const OtherUser = (props: OtherUserProps) => {
  const [unfollowing, setUnfollowing] = useState<boolean>(false);
  const unfollow = async () => {
    setUnfollowing(true);
    const response = await unfollowUserApi(props.otherUser.id);
    if (response) {
      props.removeOtherUser(props.otherUser.id);
      toast.success("Unfollowed user");
    } else {
      toast.error("Error while unfollowing user");
    }
    setUnfollowing(false);
  };
  return (
    <div
      className=" relative flex flex-col w-56 aspect-square rounded-lg bg-richblue-900 hover:bg-richblue-500
       hover:scale-[118%] transition-all duration-500 ease-in-out hover:z-50 justify-between hover:[box-shadow:0_0_20px_#333] "
    >
      {props.otherUser.imageUrl ? (
        <img
          alt="Loading..."
          src={props.otherUser.imageUrl}
          className=" w-8/12  mt-3 hover:ring-2 self-center aspect-square rounded-full "
        />
      ) : (
        <RxAvatar className=" w-8/12  mt-3 hover:ring-2 self-center aspect-square rounded-full " />
      )}
      <div className=" flex text-white mx-3 mb-1 justify-between">
        <div className=" flex flex-col">
          <div className=" text-[0.9rem] truncate">{props.otherUser.firstName + " " + props.otherUser.lastName}</div>
          <div className=" text-[0.8rem] text-snow-500 truncate ">{props.otherUser.userName}</div>
        </div>
        <button
          onClick={() => unfollow()}
          disabled={unfollowing}
          className=" w-fit h-fit self-center text-[0.9rem] hover:text-snow-300 "
        >
          Unfollow
        </button>
      </div>
    </div>
  );
};

export default OtherUser;
