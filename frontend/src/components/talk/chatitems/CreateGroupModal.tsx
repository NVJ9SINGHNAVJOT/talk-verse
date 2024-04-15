import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useRef } from "react";

type CreateGroupModalProps = {
  toggelCreateGroupModal: () => void,
}

const CreateGroupModal = (props: CreateGroupModalProps) => {
  const { toggelCreateGroupModal } = props;

  const refModal = useRef<HTMLDivElement>(null);


  useOnClickOutside(refModal, toggelCreateGroupModal);
  return (
    <div className='fixed inset-0 w-screen h-screen backdrop-blur-[1px] bg-transparent z-[1000] flex justify-center items-center'>

      <div ref={refModal} className=" flex justify-center items-center gap-6 p-8">

        <input  type="text" placeholder="Create Group" className=" w-[15rem] h-[3rem] bg-black p-4 text-white 
           rounded-md"
        />

        <div className=" bg-black text-whitesmoke px-4 h-[3rem] rounded-md py-[0.6rem] cursor-pointer">Create</div>



      </div>

    </div>
  );
};

export default CreateGroupModal;