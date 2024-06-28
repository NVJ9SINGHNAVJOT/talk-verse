import { BackgroundBeams } from "@/lib/sections/BackgroundBeams";
import { categories, maxFileSize, validFiles } from "@/utils/constants";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { toast } from "react-toastify";
import MediaFiles from "@/components/core/blog/media/MediaFiles";
import { createPostApi } from "@/services/operations/postApi";
import { useDispatch } from "react-redux";
import { updateTotalPosts } from "@/redux/slices/postSlice";

export type FileUrl = { type: string; url: string };

const checkFiles = (files: FileList, setMediaUrls: React.Dispatch<React.SetStateAction<FileUrl[]>>): File[] => {
  const newFiles: File[] = [];
  const newUrls: FileUrl[] = [];
  for (const file of files) {
    if (file.size > maxFileSize) {
      return [];
    } else if (validFiles.image.includes(file.type)) {
      newFiles.push(file);
      newUrls.push({ type: "image", url: URL.createObjectURL(file) });
    } else if (validFiles.video.includes(file.type)) {
      newFiles.push(file);
      newUrls.push({ type: "video", url: URL.createObjectURL(file) });
    }
  }
  setMediaUrls(newUrls);
  return newFiles;
};

type CreatePostProps = {
  setCreatePost: React.Dispatch<React.SetStateAction<boolean>>;
};

type PostData = {
  category: string;
  title?: string;
  content?: string;
};

const CreatePost = (props: CreatePostProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const mediaFilesInputRef = useRef<HTMLInputElement>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaUrls, setMediaUrls] = useState<FileUrl[]>([]);
  const { register, handleSubmit, reset } = useForm<PostData>();
  const dispatch = useDispatch();

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
    let linesArray;

    if (data.content) {
      linesArray = data.content.split(/\r?\n/);
      while (linesArray.length && linesArray[0] === "") {
        linesArray.shift();
      }
      while (linesArray.length && linesArray[linesArray.length - 1] === "") {
        linesArray.pop();
      }
    }
    // either content or media files are required for post
    if ((!linesArray || linesArray.length === 0) && mediaFiles.length === 0) {
      toast.info("Either media or content is required for post");
      return;
    }
    if (tags.length > 0) {
      for (let index = 0; index < tags.length; index++) {
        if (tags[index].length > 255) {
          toast.info("Max length for a tag is 255");
          return;
        }
      }
    }

    // validation done for form
    setMediaUrls([]);
    reset();
    props.setCreatePost(false);
    const newData = new FormData();
    newData.append("category", data.category.toLowerCase());
    if (data.title) {
      newData.append("title", data.title);
    }
    if (mediaFiles.length) {
      mediaFiles.forEach((file) => newData.append("postFiles", file));
    }
    if (linesArray && linesArray.length) {
      newData.append("content", JSON.stringify(linesArray));
    }
    if (tags.length) {
      newData.append("tags", JSON.stringify(tags));
    }
    const tid = toast.loading("Creating Post");
    const response = await createPostApi(newData);
    toast.dismiss(tid);
    if (response) {
      toast.success("New post created");
      dispatch(updateTotalPosts(1));
      return;
    }
    toast.error("Error creating post");
  };

  return (
    <div
      className="absolute z-40 flex h-auto min-h-full w-full min-w-minContent justify-center overflow-y-auto 
    backdrop-blur-[10px]"
    >
      <div className="absolute z-50 mx-auto flex w-[34rem] flex-col md:w-[40rem]">
        <MdOutlineCancelPresentation
          onClick={() => props.setCreatePost(false)}
          className="mt-4 h-8 w-11 cursor-pointer self-end fill-white hover:fill-slate-300"
        />
        {/* create post form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-10 flex w-full flex-col gap-y-6 font-be-veitnam-pro text-black"
        >
          {/* select category */}
          <div className="flex flex-col gap-y-1">
            <label className="text-[1.1rem] text-white">Category</label>
            <select
              className="cursor-pointer border-[2px] border-transparent bg-transparent py-1 text-white outline-none 
              hover:border-snow-700"
              {...register("category", {
                required: true,
              })}
              defaultValue={""} // Set the default value here
            >
              <option disabled value={""} className="bg-neutral-900 text-center">
                Select Category
              </option>
              {categories.map((category, index) => (
                <option className="bg-neutral-900 text-center" key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {/* title */}
          <div className="flex flex-col gap-y-1">
            <label className="text-[1.1rem] text-white">Title</label>
            <input
              className="rounded-lg bg-snow-600 p-2 text-sm text-black outline-none"
              {...register("title", {
                minLength: 1,
                maxLength: 100,
              })}
              maxLength={100}
              placeholder="Title"
            />
          </div>
          {/* media files */}
          <div className="relative flex w-full flex-col gap-y-1">
            <input
              ref={mediaFilesInputRef}
              className="absolute hidden h-0 w-0"
              type="file"
              multiple
              accept=".jpg ,.jpeg, .png, .mp4, .webm, .oog"
              placeholder=""
              onChange={handleMediaFiles}
            />
            <div className="flex items-center justify-between">
              <label className="text-[1.1rem] text-white">Media</label>
              {mediaFiles.length !== 0 && (
                <div
                  onClick={() => {
                    setMediaFiles([]);
                    setMediaUrls([]);
                  }}
                  className="cursor-pointer rounded-xl bg-white px-2 py-1 text-xs text-black transition-all 
                  delay-0 duration-150 ease-in-out hover:bg-snow-500"
                >
                  Remove
                </div>
              )}
            </div>
            {mediaUrls.length === 0 ? (
              <div
                className="flex h-64 w-10/12 cursor-pointer flex-col items-center justify-center gap-y-1 
                self-center rounded-lg bg-neutral-950 text-white transition-all ease-linear hover:bg-opacity-80"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => mediaFilesInputRef.current?.click()}
              >
                <div className="mb-4 text-2xl">Drop Files</div>
                <div className="text-xs">Images (jpeg, jpg, png)</div>
                <div className="text-xs">Video (mp4, webm, oog)</div>
                <p className="text-xs">Max files 5 and each file can be of max size 5mb</p>
              </div>
            ) : (
              <MediaFiles mediaUrls={mediaUrls} className="flex h-64 w-10/12 items-center justify-center self-center" />
            )}
          </div>
          {/* content */}
          <div className="flex flex-col gap-y-1">
            <label className="text-[1.1rem] text-white">Content</label>
            <textarea
              className="h-[20rem] resize-none rounded-lg bg-snow-600 p-2 text-sm text-black outline-none"
              {...register("content", {
                maxLength: 1000,
              })}
              maxLength={1000}
              placeholder="Content"
            />
          </div>
          {/* tags */}
          <div className="flex flex-col gap-y-1">
            <label className="text-[1.1rem] text-white">Tags</label>
            <input
              onChange={(e) => handleTagsChange(e)}
              className="mb-4 rounded-lg bg-snow-600 p-2 text-sm text-black outline-none"
              placeholder="Tags: eg - universe, vibe, lifestyle"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => {
                  return (
                    <span
                      key={index}
                      className="inline-flex items-center justify-center rounded-full border border-gray-800 
                      bg-gray-950 px-3 py-1 text-xs text-gray-300 backdrop-blur-3xl"
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

          <button
            type="submit"
            className="flex w-fit cursor-pointer self-center rounded-full border border-gray-600 bg-gradient-to-r 
            from-gray-800 to-black px-14 py-3 font-be-veitnam-pro font-semibold tracking-[.25em] text-white 
            transition-all duration-200 ease-linear [text-shadow:0_0_5px_#59deed] hover:scale-105 
            hover:border-gray-800 hover:from-black hover:to-gray-900"
          >
            Create
          </button>
        </form>
      </div>
      <BackgroundBeams />
    </div>
  );
};

export default CreatePost;
