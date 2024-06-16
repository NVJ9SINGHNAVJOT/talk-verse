import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useRef } from "react";
import { getUsersApi, sendRequestApi } from "@/services/operations/notificationApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";
import { UserRequest } from "@/redux/slices/chatSlice";
import { CiCirclePlus } from "react-icons/ci";
import { useAppSelector } from "@/redux/store";

type SearchModalProps = {
  toggleSearchModal: () => void;
};

const SearchModal = (props: SearchModalProps) => {
  const { toggleSearchModal } = props;
  const refModal = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<UserRequest[]>([]);
  const myFriends = useAppSelector((state) => state.chat.friends);

  useOnClickOutside(refModal, toggleSearchModal);

  const sendRequest = async (userId: string) => {
    setUsers((prev) => prev.filter((user) => user._id !== userId));
    const response = await sendRequestApi(userId);
    if (response) {
      toast.success("Request send successfully");
    } else {
      toast.error("Error while sending request");
    }
  };

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      if (query) {
        const response = await getUsersApi(query);

        if (response && response.success == true) {
          if (response.users) {
            const newUsers: UserRequest[] = response.users.filter(
              (newUser) => !myFriends.some((friend) => newUser._id === friend._id)
            );
            if (newUsers.length === 0) {
              toast.info("No new users for this username");
            }
            setUsers(newUsers);
          } else {
            toast.error("No user exist for such name");
          }
        } else if (response && response.success === false) {
          toast.info("No user exist for such name");
          setUsers([]);
        } else {
          toast.error("error while checking user name");
          setUsers([]);
        }
      }
    }, 1000);
    return () => clearTimeout(timeOutId);
  }, [query]);

  return (
    <div className="fixed inset-0 w-screen h-screen backdrop-blur-[1px] bg-transparent z-[1000] flex justify-center items-center overflow-y-auto">
      <div ref={refModal}>
        <div className="ct-searchInput relative flex justify-center">
          <input type="text" placeholder="Search Username" onChange={(event) => setQuery(event.target.value)} />

          {users.length > 0 && (
            <div
              className=" absolute flex flex-wrap justify-center gap-7 top-24 w-[35rem]  max-w-[40rem] text-white 
          max-h-[calc(100vh-62vh)] overflow-y-scroll"
            >
              {users.map((user, index) => {
                return (
                  <div key={index} className=" flex w-fit items-center gap-x-3 bg-black  px-3 py-1 rounded-lg">
                    {user.imageUrl ? (
                      <img src={user.imageUrl} className=" rounded-full w-10 h-10 aspect-auto" alt="Loading..." />
                    ) : (
                      <RxAvatar className="w-10 h-10 aspect-auto" />
                    )}
                    <div className=" truncate">{user.userName}</div>
                    <CiCirclePlus
                      onClick={() => sendRequest(user._id)}
                      className=" text-white w-8 h-8 aspect-auto cursor-pointer hover:bg-white hover:text-black rounded-full"
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
