import { BackgroundBeams } from "@/lib/sections/BackgroundBeams";
import { maxFileSize, validFiles } from "@/utils/constants";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { toast } from "react-toastify";
import MediaFiles from "./MediaFiles";

const categories = [
  "Technology",
  "Lifestyle",
  "Blog",
  "Nature",
  "Music",
  "Sports",
  "Health",
  "Finance",
  "Art",
  "History",
  "Literature",
  "Science",
  "Business",
  "Other",
];

const checkFiles = (files: FileList, setMediaUrls: React.Dispatch<React.SetStateAction<string[]>>): File[] => {
  const newFiles: File[] = [];
  const newUrls: string[] = [];
  for (const file of files) {
    if (file.size > maxFileSize || !(validFiles.image.includes(file.type) || validFiles.video.includes(file.type))) {
      return [];
    }
    newFiles.push(file);
    newUrls.push(URL.createObjectURL(file));
  }
  setMediaUrls(newUrls);
  return newFiles;
};

type CreatePostProps = {
  setCreatePost: React.Dispatch<React.SetStateAction<boolean>>;
};

type PostData = {
  category: string;
  title: string;
  content: string;
};

const CreatePost = (props: CreatePostProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const mediaFilesInputRef = useRef<HTMLInputElement>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const { register, handleSubmit, reset } = useForm<PostData>();

  const handleTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const newTags: string[] = [];

    event.target.value.split(",").forEach((tag) => {
      if (tag.trim() !== "") {
        newTags.push(tag.trim());
      }
    });

    setTags(newTags);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files.length > 5) {
      toast.info("Max 5 media files are allowed");
      return;
    }
    const droppedFiles = checkFiles(event.dataTransfer.files, setMediaUrls);

    if (droppedFiles.length === 0) {
      toast.info("Invalid media files");
      return;
    }
    setMediaFiles(droppedFiles);
  };

  const handleMediaFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      if (files.length > 5) {
        toast.info("Max 5  files are allowed");
        if (mediaFilesInputRef.current) {
          mediaFilesInputRef.current.value = "";
        }
        return;
      }

      const checkedFiles = checkFiles(files, setMediaUrls);

      if (checkedFiles.length === 0) {
        toast.info("Invlaid media files");
      } else {
        setMediaFiles(checkedFiles);
      }

      if (mediaFilesInputRef.current) {
        mediaFilesInputRef.current.value = "";
      }
    }
  };

  const onSubmit = async (data: PostData) => {
    const linesArray = data.content.split(/\r?\n/);
    while (linesArray.length && linesArray[0] === "") {
      linesArray.shift();
    }
    while (linesArray.length && linesArray[linesArray.length - 1] === "") {
      linesArray.pop();
    }
    if (mediaFiles.length === 0 && linesArray.length === 0) {
      toast.info("Either media or content is required for post");
      return;
    }
    reset();
    console.log(data, mediaFiles, linesArray, tags);
  };

  return (
    <div className=" absolute flex justify-center z-40 backdrop-blur-[7px] w-full min-h-full h-auto min-w-minContent overflow-y-auto">
      <div className=" absolute z-50 mx-auto flex flex-col w-[34rem] md:w-[40rem]">
        <div onClick={() => props.setCreatePost(false)} className=" cursor-pointer self-end">
          <MdOutlineCancelPresentation className="w-11 h-8 fill-white hover:fill-slate-300 mt-4" />
        </div>
        {/* create post form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full font-be-veitnam-pro flex flex-col mb-10 gap-y-6 text-white"
        >
          {/* select category */}
          <div className=" flex flex-col gap-y-1">
            <label className=" text-[1.1rem]">Category</label>
            <select
              className="bg-transparent outline-none cursor-pointer border-[2px] border-transparent hover:border-snow-700 py-1"
              {...register("category", {
                required: true,
              })}
              defaultValue={""} // Set the default value here
            >
              <option disabled value={""} className=" text-center bg-neutral-900">
                Select Category
              </option>
              {categories.map((category, index) => (
                <option className=" text-center bg-neutral-900" key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {/* title */}
          <div className=" flex flex-col gap-y-1">
            <label className=" text-[1.1rem]">Title</label>
            <input
              className=" outline-none text-sm text-black rounded-lg p-2 bg-snow-600 focus:bg-transparent
                   focus:text-white transition-all ease-in-out duration-100"
              {...register("title", {
                minLength: 1,
                maxLength: 200,
              })}
              placeholder="Title"
            />
          </div>
          {/* media files */}
          <div className="relative flex flex-col w-full gap-y-1">
            <input
              ref={mediaFilesInputRef}
              className=" absolute w-0 h-0 hidden"
              type="file"
              multiple
              accept=".jpg ,.jpeg, .png, .mp4, .webm, .oog"
              placeholder=""
              onChange={handleMediaFiles}
            />
            <label className=" text-[1.1rem]">Media</label>
            {mediaFiles.length === 0 ? (
              <div
                className=" w-10/12 h-64 flex flex-col gap-y-1 justify-center items-center self-center rounded-lg bg-neutral-950
                    hover:bg-transparent cursor-pointer transition-all duration-100 ease-in-out"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => mediaFilesInputRef.current?.click()}
              >
                <div className="mb-4 text-2xl">Drop Files</div>
                <div className=" text-xs">Images (jpeg, jpg, png)</div>
                <div className=" text-xs">Video (mp4, webm, oog)</div>
                <p className=" text-xs">Max files 5 and each file can be of max size 5mb</p>
              </div>
            ) : (
              <MediaFiles
                mediaUrls={mediaUrls}
                className=" w-10/12 h-64 flex justify-center items-center self-center"
              />
            )}
          </div>
          {/* content */}
          <div className=" flex flex-col gap-y-1">
            <label className=" text-[1.1rem]">Content</label>
            <textarea
              className=" h-[20rem] outline-none resize-none text-sm text-black rounded-lg p-2 bg-snow-600 focus:bg-transparent
                   focus:text-white transition-all ease-in-out duration-100"
              {...register("content")}
              placeholder="Content"
            />
          </div>
          {/* tags */}
          <div className=" flex flex-col gap-y-1">
            <label className=" text-[1.1rem]">Tags</label>
            <input
              onChange={(e) => handleTagsChange(e)}
              className=" outline-none text-sm text-black rounded-lg p-2 bg-snow-600 focus:bg-transparent
                   focus:text-white transition-all ease-in-out duration-100 mb-4"
              placeholder="Tags: eg - universe, vibe, lifestyle"
            />
            {tags.length > 0 && (
              <div className=" flex flex-wrap gap-2">
                {tags.map((tag, index) => {
                  return (
                    <span
                      key={index}
                      className="inline-flex items-center justify-center rounded-full border border-gray-800 bg-gray-950 px-3 py-1 text-xs text-gray-300 backdrop-blur-3xl"
                    >
                      <span className="bg-gradient-to-t from-[#fff] to-[#8678f9] bg-clip-text text-transparent">
                        {tag}
                      </span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          <button className=" text-white" type="submit">
            Submit
          </button>
        </form>
      </div>
      <BackgroundBeams />
    </div>
  );
};

export default CreatePost;
