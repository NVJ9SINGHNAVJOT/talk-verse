import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useRef } from "react";
import { getFollowUsersApi, getUsersApi, sendRequestApi } from "@/services/operations/notificationApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";
import { UserRequest } from "@/redux/slices/chatSlice";
import { CiCirclePlus } from "react-icons/ci";
import { FollowUsers } from "@/types/apis/notificationApiRs";

type SearchModalProps = {
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  requestType: "friend" | "follow";
  // eslint-disable-next-line no-unused-vars
  sendFollowRequest?: (reqUserId: number) => Promise<boolean>;
};

const SearchModal = (props: SearchModalProps) => {
  const refModal = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<(UserRequest & { isAlreadyRequested: boolean })[]>([]);
  const [followUsers, setFollowUsers] = useState<FollowUsers[]>([]);
  const [sending, setSending] = useState<(number | string)[]>([]);

  useOnClickOutside(refModal, () => props.setIsSearchOpen(false));

  const sendRequest = async (userId: string | number) => {
    sending.push(userId);
    setSending(sending);
    if (props.requestType === "friend" && typeof userId === "string") {
      const response = await sendRequestApi(userId);
      if (response) {
        setUsers((prev) => prev.filter((user) => user._id !== userId));
        toast.success("Request send successfully");
      } else {
        toast.error("Error while sending request");
      }
    } else if (typeof userId === "number" && props.sendFollowRequest) {
      const response = await props.sendFollowRequest(userId);
      if (response) {
        setFollowUsers((prev) => prev.filter((followUser) => followUser.id !== userId));
      }
    }
    setSending((prev) => prev.filter((reqUserId) => reqUserId !== userId));
  };

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      if (query) {
        const response = props.requestType === "friend" ? await getUsersApi(query) : await getFollowUsersApi(query);

        if (response) {
          if ("users" in response && response.users) {
            setUsers(response.users);
          } else if ("followUsers" in response && response.followUsers) {
            setFollowUsers(response.followUsers);
          } else {
            toast.error("No user exist for such name");
            props.requestType === "friend" ? setUsers([]) : setFollowUsers([]);
          }
        } else {
          toast.error("error while checking user name");
          props.requestType === "friend" ? setUsers([]) : setFollowUsers([]);
        }
      }
    }, 1000);
    return () => clearTimeout(timeOutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="fixed inset-0 z-[1000] flex h-screen w-screen justify-center overflow-y-auto bg-transparent backdrop-blur-[5px]">
      <div ref={refModal} className="mt-[calc(100vh-70vh)]">
        <div className="ct-searchInput relative flex justify-center">
          <input type="text" placeholder="Search Username" onChange={(event) => setQuery(event.target.value)} />

          {users.length > 0 && (
            <div className="absolute top-24 flex max-h-[calc(100vh-62vh)] w-[35rem] max-w-[40rem] flex-wrap justify-center gap-7 
            overflow-y-auto text-white">
              {users.map((user, index) => {
                return (
                  <div key={index} className="flex w-fit items-center gap-x-3 rounded-lg bg-black px-3 py-1">
                    {user.imageUrl ? (
                      <img src={user.imageUrl} className="size-10 min-w-10 rounded-full object-fill" alt="Loading..." />
                    ) : (
                      <RxAvatar className="size-10 min-w-10 rounded-full object-fill" />
                    )}
                    <div className="truncate">{user.userName}</div>
                    {user.isAlreadyRequested === true ? (
                      <div className="text-xs text-snow-900">requested</div>
                    ) : (
                      <button onClick={() => sendRequest(user._id)} disabled={sending.includes(user._id)}>
                        <CiCirclePlus className="aspect-auto h-8 w-8 cursor-pointer rounded-full text-white 
                        hover:bg-white hover:text-black" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {followUsers.length > 0 && (
            <div className="absolute top-24 flex max-h-[calc(100vh-62vh)] w-[35rem] max-w-[40rem] flex-wrap justify-center gap-7 overflow-y-auto 
            text-white">
              {followUsers.map((user, index) => {
                return (
                  <div key={index} className="flex max-w-full flex-col gap-y-2 rounded-lg bg-black px-5 py-1">
                    <div className="flex items-center gap-x-3">
                      {user.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          className="size-10 min-w-10 rounded-full object-fill"
                          alt="Loading..."
                        />
                      ) : (
                        <RxAvatar className="size-10 min-w-10 rounded-full" />
                      )}
                      <div className="max-w-fit truncate">{user.userName}</div>
                    </div>
                    {user.isFollowed === true || user.isFollower === true || user.isRequested === true ? (
                      <div className="self-center text-xs text-snow-900">
                        {user.isRequested ? "requested" : user.isFollowed ? "following" : "follower"}
                      </div>
                    ) : (
                      <button
                        disabled={sending.includes(user.id)}
                        onClick={() => sendRequest(user.id)}
                        className="w-10/12 min-w-fit self-center rounded-full bg-white text-[0.8rem] text-black transition-all ease-in-out 
                        hover:bg-black hover:text-white"
                      >
                        follow
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
