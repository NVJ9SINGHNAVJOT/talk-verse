import { useScrollTriggerVertical } from "@/hooks/useScrollTrigger";
import { userfollowersApi } from "@/services/operations/profileApi";
import { type UserSuggestion } from "@/types/apis/notificationApiRs";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import OtherUser from "@/components/core/profile/otheruser/OtherUser";
import CubeLoader from "@/lib/loaders/cubeloader/CubeLoader";

const Followers = () => {
  const [stop, setStop] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(true);
  const followersContainer = useRef<HTMLDivElement>(null);
  const [followers, setFollowers] = useState<(UserSuggestion & { createdAt: string })[]>([]);

  useScrollTriggerVertical(followersContainer, "down", setTrigger, stop, undefined, loading);

  const removeOtherUser = (otherUserId: number) => {
    setFollowers((prev) => prev.filter((otherUser) => otherUser.id !== otherUserId));
  };

  useEffect(() => {
    const getUsers = async () => {
      if (loading) {
        return;
      }
      setLoading(true);
      let lastCreatedAt;
      if (followers.length === 0) {
        lastCreatedAt = new Date().toISOString();
      } else {
        lastCreatedAt = followers[followers.length - 1].createdAt;
      }

      const response = await userfollowersApi(lastCreatedAt);
      if (response) {
        if (response.followers) {
          const withNewFollwers = [...followers, ...response.followers];
          if (response.followers.length < 20) {
            setStop(true);
          }
          setFollowers(withNewFollwers);
        } else {
          setStop(true);
        }
      } else {
        toast.error("Error while getting followers users");
      }
      setLoading(false);
    };
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <div
      ref={followersContainer}
      className="w-full h-full flex flex-wrap justify-center py-6 px-8 lg:px-12 lg:p-12 gap-8
     overflow-y-auto bg-[linear-gradient(135deg,_#fdfcfb_0%,_#e2d1c3_100%)]"
    >
      {followers.length > 0 ? (
        followers.map((otherUser, index) => (
          <OtherUser key={index} otherUser={otherUser} userType="followers" removeOtherUser={removeOtherUser} />
        ))
      ) : (
        <CubeLoader className="self-center" />
      )}
    </div>
  );
};

export default Followers;
