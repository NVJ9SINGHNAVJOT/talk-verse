import "@/lib/inputs/chatsearchinput/ChatSearchInput.css";
import {
  getUsersApi,
  sendRequestApi,
} from "@/services/operations/notificationApi";
import { GetUsersRs } from "@/types/apis/notificationApiRs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";
import { UserRequest } from "@/redux/slices/chatSlice";
import { CiCirclePlus } from "react-icons/ci";

const ChatSearchInput = () => {
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<UserRequest[]>([]);

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
        const response: GetUsersRs = await getUsersApi(query);

        if (response && response.success == true) {
          if (response.users) {
            setUsers(response.users);
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
    <div className="input-container relative flex justify-center">
      <input
        type="text"
        placeholder="Search Username"
        onChange={(event) => setQuery(event.target.value)}
      />

      {users && (
        <div className=" absolute flex flex-wrap justify-center gap-7 top-36 sm:top-24 sm:w-[35rem]  max-w-[40rem] text-white">
          {users.map((user, index) => {
            return (
              <div
                key={index}
                className=" flex w-fit items-center gap-x-3 bg-black  px-3 py-1 rounded-lg"
              >
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    className=" rounded-full w-10 h-10 aspect-auto"
                    alt="Loading..."
                  />
                ) : (
                  <RxAvatar className="w-10 h-10 aspect-auto" />
                )}
                <div>{user.userName}</div>
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
  );
};

export default ChatSearchInput;
