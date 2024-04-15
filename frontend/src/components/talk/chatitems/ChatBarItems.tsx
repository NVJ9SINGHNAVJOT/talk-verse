import { RxAvatar } from "react-icons/rx";


const ChatBarItems = () => {
  return (
    <div className="w-full h-[3.5rem] flex justify-between items-center py-2 px-4 cursor-pointer
      transition-all duration-100 ease-in-out delay-0 hover:bg-[#21262C]"
    >

        <div className="flex items-center">
            <RxAvatar className=" w-10 h-10 aspect-square text-white"/>
            <p className=" pl-4 text-white text-lg">lorem</p>
        </div>

        <div className=" rounded-full bg-green size-3">

        </div>
        
    </div>
  );
};

export default ChatBarItems;