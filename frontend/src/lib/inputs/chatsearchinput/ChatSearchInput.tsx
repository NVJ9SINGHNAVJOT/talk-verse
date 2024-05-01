import "@/lib/inputs/chatsearchinput/ChatSearchInput.css";
import { getUsersApi } from "@/services/operations/notificationApi";
import { GetUsersApi } from "@/types/apis/notificationApiRs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";

export type ReqUser = {
  _id: string;
  userName: string;
  imageUrl: string;
};

const ChatSearchInput = () => {
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<ReqUser[]>([]);

  const sendRequest = async (userId: string) => {
    setUsers((prev) => prev.filter((user) => user._id !== userId));
  };

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      if (query) {
        const response: GetUsersApi = await getUsersApi(query);

        if (response && response.success == true) {
          if (response.users) {
            setUsers(response.users);
          } else {
            toast.error("No user exist for such name");
          }
        } else if (response && response.success === false) {
          toast.error(response.message);
        } else {
          toast.error("error while checking user name");
        }
      }
    }, 1000);
    return () => clearTimeout(timeOutId);
  }, [query]);

  return (
    <div className="input-container relative">
      <input
        type="text"
        placeholder="Search Username"
        onChange={(event) => setQuery(event.target.value)}
      />

      {users && (
        <div className=" absolute flex flex-wrap top-36 sm:top-24 w-[30rem] max-w-maxContent text-white">
          {users.map((user, index) => {
            return (
              <div
                key={index}
                className=" flex items-center gap-x-3 bg-black hover:bg-transparent cursor-pointer px-3 py-1 rounded-lg"
                onClick={() => sendRequest(user._id)}
              >
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    className=" rounded-full w-10 h-10 aspect-auto"
                    alt="Loading..."
                  />
                ) : (
                  <RxAvatar className="w-10 h-10" />
                )}
                <div>{user.userName}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChatSearchInput;
