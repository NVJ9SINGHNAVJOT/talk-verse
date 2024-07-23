import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useRef } from "react";
import { MdOutlineCancelPresentation } from "react-icons/md";

type SignUpSuccessProps = {
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
};

const SignUpSuccess = (props: SignUpSuccessProps) => {
  const mainDiv = useRef<HTMLDivElement>(null);
  const excDiv = useRef<HTMLDivElement>(null);

  useOnClickOutside(mainDiv, () => props.setSuccess(false), excDiv);

  return (
    <div
      className="fixed inset-0 z-[2000] flex h-screen w-screen items-center justify-center overflow-y-auto 
    bg-transparent backdrop-blur"
    >
      <div
        ref={mainDiv}
        className="relative w-[35rem] rounded-xl border-[1px] border-solid border-[rgb(255_255_255/5%)] 
        bg-[rgb(16_16_16)] p-4 lm:w-[40rem] xl:w-[45rem]"
      >
        <div ref={excDiv}>
          <MdOutlineCancelPresentation
            title="close"
            onClick={() => props.setSuccess(false)}
            className="absolute right-1 top-1 h-8 w-11 cursor-pointer self-end fill-white hover:fill-slate-300"
          />
        </div>
        <div
          className="flex flex-col items-center justify-center gap-y-16 overflow-hidden rounded-[1.25rem] 
        bg-[radial-gradient(_rgba(255,_255,_255,_0.1)_1px,_transparent_1px_)] bg-[50%_50%] p-[2.3rem] 
        [background-size:1.1rem_1.1rem]"
        >
          <h3 className="text-3xl text-white">
            Check your mail for <span className="rounded-lg bg-indigo-700 px-4 py-2">Private Key</span>
          </h3>
          <div className="rounded-xl bg-snow-400 p-5 text-center text-xl text-red-800">
            <div className="animate-bounce text-center text-4xl font-bold">!Important</div>
            <br />
            <p>
              Please keep this key confidential and do not share it with anyone. If you lose this key, you will be
              unable to access the chat. We recommend storing it in a safe place, such as a password manager or a secure
              note.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpSuccess;
