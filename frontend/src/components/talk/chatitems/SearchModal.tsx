import useOnClickOutside from "@/hooks/useOnClickOutside";
import ChatSearchInput from "@/lib/inputs/chatsearchinput/ChatSearchInput";
import { useRef } from "react";

type SearchModalProps = {
    toggleSearchModal: () => void,
}

const SearchModal = (props: SearchModalProps) => {

    const { toggleSearchModal } = props
    const refModal = useRef<HTMLDivElement>(null);


    useOnClickOutside(refModal, toggleSearchModal);



    return (
        <div className='fixed inset-0 w-screen h-screen backdrop-blur-[1px] bg-transparent z-[1000] flex justify-center items-center'>

            <div ref={refModal}>
                <ChatSearchInput />
            </div>


        </div>
    );
};

export default SearchModal;