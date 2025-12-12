import { CiImageOn } from "react-icons/ci";
import { RiFileVideoLine } from "react-icons/ri";
import { FaRegFilePdf } from "react-icons/fa6";
import { LiaFileAudio } from "react-icons/lia";
import { useRef, useState } from "react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { MdAttachFile } from "react-icons/md";
import { toast } from "react-toastify";
import { maxFileSize, validFiles } from "@/utils/constants";

type FileInputsProps = {
  fileHandler: (file: File) => Promise<void>;
};

const FileInputs = (props: FileInputsProps) => {
  const fileMenuClickOut = useRef<HTMLDivElement>(null);
  const fileMenuExlcudes = useRef<HTMLDivElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [fileTyp, setFileTyp] = useState<string>();
  const [fileMenu, setFileMenu] = useState<boolean>(false);

  useOnClickOutside(fileMenuClickOut, () => setFileMenu(false), fileMenuExlcudes);

  const handleFileMenu = () => {
    setFileMenu((prev) => !prev);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!fileTyp) {
      toast.error("Error while selecting file");
      return;
    }
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > maxFileSize) {
        toast.info("Max 5mb file is allowed");
        return;
      }

      const currFileType = file.type;
      switch (fileTyp) {
        case "image":
          if (!validFiles.image.includes(currFileType)) {
            toast.info("only .jpeg, .jpg, .png allowed");
            return;
          } else if (imageInputRef.current) {
            imageInputRef.current.value = "";
          }
          break;
        case "video":
          if (!validFiles.video.includes(currFileType)) {
            toast.info("only .mp4, .webm, .ogg allowed");
            return;
          } else if (videoInputRef.current) {
            videoInputRef.current.value = "";
          }
          break;
        case "audio":
          if (!validFiles.audio.includes(currFileType)) {
            toast.info("only .mp3, .mpeg, .wav allowed");
            return;
          } else if (audioInputRef.current) {
            audioInputRef.current.value = "";
          }
          break;
        case "pdf":
          if (validFiles.pdf !== currFileType) {
            toast.info("only pdf allowed");
            return;
          } else if (pdfInputRef.current) {
            pdfInputRef.current.value = "";
          }
          break;
        default:
          toast.error("Invalid file input");
          return;
      }

      props.fileHandler(file);

      setFileMenu(false);
    }
  };

  const handleFileInputType = (type: string) => {
    switch (type) {
      case "image":
        setFileTyp(type);
        imageInputRef.current?.click();
        break;
      case "video":
        setFileTyp(type);
        videoInputRef.current?.click();
        break;
      case "audio":
        setFileTyp(type);
        audioInputRef.current?.click();
        break;
      case "pdf":
        setFileTyp(type);
        pdfInputRef.current?.click();
        break;
    }
  };

  return (
    <div className="relative w-fit h-fit">
      <div ref={fileMenuExlcudes} onClick={handleFileMenu}>
        <MdAttachFile className=" fill-snow-800 hover:fill-white cursor-pointer size-11" />
      </div>
      {/* file menu */}
      {fileMenu && (
        <div
          ref={fileMenuClickOut}
          className="absolute bottom-16 rounded-md px-4 py-2 z-50  flex gap-3 bg-[rgb(7,18,25)] 
    bg-[linear-gradient(207deg,_rgba(7,18,25,1)_12%,_rgba(85,130,172,1)_80%)] "
        >
          <div className=" group relative flex ">
            <CiImageOn
              onClick={() => handleFileInputType("image")}
              className=" size-11 aspect-square p-2 cursor-pointer  rounded-md
          bg-teal-300"
            />
            <div
              className="absolute group-hover:opacity-100 group-hover:visible group-hover:-top-[50px] font-be-veitnam-pro font-semibold
         -top-[30px] left-2/4 -translate-x-1/2 text-[#fff] opacity-0 invisible text-[14px] [transition:all_0.3s_ease]"
            >
              Image
            </div>
          </div>
          <div className="group relative ">
            <RiFileVideoLine
              onClick={() => handleFileInputType("video")}
              className=" size-11 aspect-square p-2 cursor-pointer  rounded-md
       bg-[rgb(238,174,202)] bg-[radial-gradient(circle,_rgba(238,174,202,1)_0%,_rgba(148,187,233,1)_100%)]"
            />
            <div
              className="absolute group-hover:opacity-100 group-hover:visible group-hover:-top-[50px] font-be-veitnam-pro font-semibold
         -top-[30px] left-2/4 -translate-x-1/2 text-[#fff]  opacity-0 invisible text-[14px] [transition:all_0.3s_ease]"
            >
              Video
            </div>
          </div>
          <div className="group relative ">
            <LiaFileAudio
              onClick={() => handleFileInputType("audio")}
              className=" size-11 aspect-square p-2 cursor-pointer  rounded-md 
      bg-[rgb(148,187,233)] bg-[linear-gradient(90deg,_rgba(148,187,233,1)_0%,_rgba(228,9,106,1)_0%)]"
            />
            <div
              className="absolute group-hover:opacity-100 group-hover:visible group-hover:-top-[50px] font-be-veitnam-pro font-semibold
         -top-[30px] left-2/4 -translate-x-1/2 text-[#fff] opacity-0 invisible text-[14px] [transition:all_0.3s_ease]"
            >
              Audio
            </div>
          </div>
          <div className="group relative ">
            <FaRegFilePdf
              onClick={() => handleFileInputType("pdf")}
              className=" size-11 aspect-square p-2  cursor-pointer  rounded-md
       bg-slate-50"
            />
            <div
              className="absolute group-hover:opacity-100 group-hover:visible group-hover:-top-[50px] font-be-veitnam-pro font-semibold 
         -top-[30px] left-2/4 -translate-x-1/2 text-[#fff]  opacity-0 invisible text-[14px] [transition:all_0.3s_ease]"
            >
              Pdf
            </div>
          </div>
        </div>
      )}
      {/* input files */}
      <input
        ref={imageInputRef}
        onChange={handleFileChange}
        className=" absolute w-0 h-0"
        type="file"
        accept="image/jpeg, image/jpg, image/png"
      />
      <input
        ref={pdfInputRef}
        onChange={handleFileChange}
        className=" absolute w-0 h-0"
        type="file"
        accept="application/pdf"
      />
      <input
        ref={videoInputRef}
        onChange={handleFileChange}
        className=" absolute w-0 h-0"
        type="file"
        accept="video/mp4, video/webm, video/ogg"
      />
      <input
        ref={audioInputRef}
        onChange={handleFileChange}
        className=" absolute w-0 h-0"
        type="file"
        accept="audio/mpeg, audio/wav, audio/mp3"
      />
    </div>
  );
};

export default FileInputs;
