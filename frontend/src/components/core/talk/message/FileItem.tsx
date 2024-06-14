import { validFiles } from "@/utils/constants";
import { VscFilePdf } from "react-icons/vsc";
import { CiFileOn } from "react-icons/ci";
import { memo, useMemo } from "react";

type FileItemProps = {
  url: string;
};

const FileItem = ({ url }: FileItemProps) => {
  const fileExt = useMemo(() => url.split(".").pop(), [url]);
  if (!fileExt) return "error";
  else if (validFiles.video.includes("video/" + fileExt)) {
    return <video src={url} controls className=" w-60 mt-4 rounded-md aspect-video" />;
  } else if (validFiles.image.includes("image/" + fileExt)) {
    return <img src={url} alt="Loading..." className=" w-56 mt-4 rounded-md aspect-auto" />;
  } else if (validFiles.audio.includes("audio/" + fileExt)) {
    return <audio src={url} controls className=" w-80 h-9 mt-4 " />;
  } else if (validFiles.pdf === "application/" + fileExt) {
    return (
      <a href={url} target="_blank" download>
        <VscFilePdf className=" size-16 aspect-square fill-amber-500 cursor-pointer" />
      </a>
    );
  } else {
    return <CiFileOn className="size-16 aspect-square" />;
  }
};

export default memo(FileItem);
