import { removeFollowerApi, unfollowUserApi } from "@/services/operations/profileApi";
import { type UserSuggestion } from "@/types/apis/notificationApiRs";
import { useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { toast } from "react-toastify";

type OtherUserProps = {
  otherUser: UserSuggestion & { createdAt: string };
  userType: "followers" | "following";
  removeOtherUser: (otherUserId: number) => void;
};

const OtherUser = (props: OtherUserProps) => {
  const [updating, setUpdating] = useState<boolean>(false);

  const unfollow = async () => {
    setUpdating(true);
    const response = await unfollowUserApi(props.otherUser.id);
    if (response) {
      props.removeOtherUser(props.otherUser.id);
      toast.success("Unfollowed user");
    } else {
      toast.error("Error while unfollowing user");
    }
    setUpdating(false);
  };

  const removeFollower = async () => {
    setUpdating(true);
    const response = await removeFollowerApi(props.otherUser.id);
    if (response) {
      props.removeOtherUser(props.otherUser.id);
      toast.success("Follower removed");
    } else {
      toast.error("Error while removing follower");
    }
    setUpdating(false);
  };

  return (
    <div
      className=" relative flex flex-col size-56 rounded-lg bg-richblue-900 hover:bg-richblue-500
       hover:scale-[118%] transition-all duration-500 ease-in-out hover:z-50 justify-between hover:[box-shadow:0_0_20px_#333] "
    >
      {props.otherUser.imageUrl ? (
        <img
          alt="Loading..."
          src={props.otherUser.imageUrl}
          className=" size-8/12  mt-3 hover:ring-2 self-center rounded-full "
        />
      ) : (
        <RxAvatar className=" size-8/12  mt-3 hover:ring-2 self-center rounded-full " />
      )}
      <div className=" flex text-white mx-3 mb-1 justify-between">
        <div className=" flex flex-col">
          <div className=" text-[0.9rem] truncate">{props.otherUser.firstName + " " + props.otherUser.lastName}</div>
          <div className=" text-[0.8rem] text-snow-500 truncate ">{props.otherUser.userName}</div>
        </div>
        <button
          onClick={() => {
            if (props.userType === "following") {
              unfollow();
            } else {
              removeFollower();
            }
          }}
          disabled={updating}
          className=" w-fit h-fit self-center text-[0.9rem] hover:text-snow-300 "
        >
          {props.userType === "following" ? "Unfollow" : "Remove"}
        </button>
      </div>
    </div>
  );
};

export default OtherUser;
