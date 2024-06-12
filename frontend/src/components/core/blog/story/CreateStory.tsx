import { maxFileSize, validFiles } from "@/utils/constants";
import { useRef, useState } from "react";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { toast } from "react-toastify";

type CreateStoryProps = {
  setCreateStory: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateStory = (props: CreateStoryProps) => {
  const [mediaFile, setMediaFile] = useState<File>();
  const mediaFilesInputRef = useRef<HTMLInputElement>(null);

  const handleMediaFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      const file = e.target.files[0];
      if (e.target.files.length > 1) {
        toast.info("Only one file is allowed");
      } else if (file.size > maxFileSize) {
        toast.info("Max 5mb image file allowed");
      } else if (validFiles.image.includes(file.type) || validFiles.video.includes(file.type)) {
        setMediaFile(file);
      } else {
        toast.error("Invalid input");
      }

      if (mediaFilesInputRef.current) {
        mediaFilesInputRef.current.value = "";
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files.length > 1) {
      toast.info("Only one file is allowed");
      return;
    }

    if (
      validFiles.image.includes(event.dataTransfer.files[0].type) ||
      validFiles.video.includes(event.dataTransfer.files[0].type)
    ) {
      setMediaFile(event.dataTransfer.files[0]);
    } else {
      toast.error("Invalid input");
    }
  };

  return (
    <div
      className="absolute flex flex-col items-center z-40 backdrop-blur-[7px] w-full min-h-full h-auto min-w-minContent 
      overflow-y-auto"
    >
      <div className="relative w-72 h-[28rem] flex flex-col items-center justify-center border-[2px] border-whitesmoke mt-20 text-white gap-y-1">
      <div onClick={() => props.setCreateStory(false)} className="absolute -right-24 -top-14 cursor-pointer">
        <MdOutlineCancelPresentation className=" w-11 h-8 fill-white hover:fill-slate-300" />
      </div>
        {mediaFile !== undefined && (
          <div
            onClick={() => setMediaFile(undefined)}
            className="absolute -top-10 text-xs cursor-pointer rounded-xl bg-white text-black hover:bg-transparent hover:text-white
            py-1 px-2 duration-[10ms] transition-all ease-linear delay-0"
          >
            Remove
          </div>
        )}
        <input
          ref={mediaFilesInputRef}
          className=" absolute w-0 h-0 hidden"
          type="file"
          multiple
          accept=".jpg ,.jpeg, .png, .mp4, .webm, .oog"
          placeholder=""
          onChange={handleMediaFile}
        />
        {mediaFile === undefined ? (
          <div
            className="h-full w-full flex flex-col gap-y-1 justify-center items-center self-center rounded-lg bg-neutral-950
                    hover:bg-transparent cursor-pointer transition-all duration-100 ease-in-out"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => mediaFilesInputRef.current?.click()}
          >
            <div className="mb-4 text-2xl">Drop File</div>
            <div className=" text-xs">Image (jpeg, jpg, png)</div>
            <div className=" text-xs">Vide (mp4, webm, oog)</div>
            <p className=" text-xs">file can be of max size 5mb</p>
          </div>
        ) : mediaFile.type.includes("image") ? (
          <img alt="Loading..." src={URL.createObjectURL(mediaFile)} />
        ) : (
          <video src={URL.createObjectURL(mediaFile)} controls />
        )}
      </div>
    </div>
  );
};

export default CreateStory;
