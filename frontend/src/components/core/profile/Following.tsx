import { useScrollTriggerVertical } from "@/hooks/useScrollTrigger";
import OtherUser from "@/components/core/profile/otheruser/OtherUser";
import { userFollowingApi } from "@/services/operations/profileApi";
import { UserSuggestion } from "@/types/apis/notificationApiRs";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const Following = () => {
  const [stop, setStop] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(true);
  const followingContainer = useRef<HTMLDivElement>(null);
  const [following, setFollowing] = useState<(UserSuggestion & { createdAt: string })[]>([]);

  useScrollTriggerVertical(followingContainer, "down", setTrigger, stop, undefined, loading);

  const removeOtherUser = (otherUserId: number) => {
    setFollowing((prev) => prev.filter((otherUser) => otherUser.id !== otherUserId));
  };

  useEffect(() => {
    const getUsers = async () => {
      if (loading) {
        return;
      }
      setLoading(true);
      let lastCreatedAt;
      if (following.length === 0) {
        lastCreatedAt = new Date().toISOString();
      } else {
        lastCreatedAt = following[following.length - 1].createdAt;
      }

      const response = await userFollowingApi(lastCreatedAt);
      if (response) {
        if (response.following) {
          const withNewFollowing = [...following, ...response.following];
          if (response.following.length < 20) {
            setStop(true);
          }
          setFollowing(withNewFollowing);
        } else {
          setStop(true);
        }
      } else {
        toast.error("Error while getting following users");
      }
      setLoading(false);
    };
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <div
      ref={followingContainer}
      className="w-full h-full flex flex-wrap justify-center py-6 px-8 lg:px-12 lg:p-12 gap-8
     overflow-y-auto bg-[linear-gradient(135deg,_#fdfcfb_0%,_#e2d1c3_100%)]"
    >
      {following.length > 0 &&
        following.map((otherUser, index) => (
          <OtherUser key={index} otherUser={otherUser} removeOtherUser={removeOtherUser} />
        ))}
    </div>
  );
};

export default Following;
