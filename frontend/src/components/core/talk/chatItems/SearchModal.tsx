import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useRef } from "react";
import { getUsersApi, sendRequestApi } from "@/services/operations/notificationApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";
import { UserRequest } from "@/redux/slices/chatSlice";
import { CiCirclePlus } from "react-icons/ci";
import { UserSuggestion } from "@/types/apis/notificationApiRs";

type SearchModalProps = {
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  requestType: "friend" | "follow";
  // eslint-disable-next-line no-unused-vars
  sendFollowRequest?: (reqUserId: number) => Promise<void>;
};

const SearchModal = (props: SearchModalProps) => {
  const refModal = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<(UserRequest & { isAlreadyRequested: boolean })[]>([]);
  const [followUsers, setFollowUsers] = useState<UserSuggestion[]>([]);

  useOnClickOutside(refModal, () => props.setIsSearchOpen(false));

  const sendRequest = async (userId: string) => {
    setUsers((prev) => prev.filter((user) => user._id !== userId));
    if (props.requestType === "friend") {
      const response = await sendRequestApi(userId);
      if (response) {
        toast.success("Request send successfully");
      } else {
        toast.error("Error while sending request");
      }
    } else if (props.sendFollowRequest) {
      await props.sendFollowRequest(userId);
    }
  };

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      if (query) {
        const response = await getUsersApi(query);

        if (response) {
          if (response.users) {
            setUsers(response.users);
          } else {
            setUsers([]);
            toast.error("No user exist for such name");
          }
        } else {
          toast.error("error while checking user name");
          setUsers([]);
        }
      }
    }, 1000);
    return () => clearTimeout(timeOutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="fixed inset-0 z-[1000] flex h-screen w-screen items-center justify-center overflow-y-auto bg-transparent backdrop-blur-[1px]">
      <div ref={refModal}>
        <div className="ct-searchInput relative flex justify-center">
          <input type="text" placeholder="Search Username" onChange={(event) => setQuery(event.target.value)} />

          {users.length > 0 && (
            <div className="absolute top-24 flex max-h-[calc(100vh-62vh)] w-[35rem] max-w-[40rem] flex-wrap justify-center gap-7 overflow-y-scroll text-white">
              {users.map((user, index) => {
                return (
                  <div key={index} className="flex w-fit items-center gap-x-3 rounded-lg bg-black px-3 py-1">
                    {user.imageUrl ? (
                      <img src={user.imageUrl} className="aspect-auto h-10 w-10 rounded-full" alt="Loading..." />
                    ) : (
                      <RxAvatar className="aspect-auto h-10 w-10" />
                    )}
                    <div className="truncate">{user.userName}</div>
                    <CiCirclePlus
                      onClick={() => sendRequest(user._id)}
                      className="aspect-auto h-8 w-8 cursor-pointer rounded-full text-white hover:bg-white hover:text-black"
                    />
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
