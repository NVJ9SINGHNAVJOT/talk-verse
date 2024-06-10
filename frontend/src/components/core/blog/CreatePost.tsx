import { BackgroundBeams } from "@/lib/sections/BackgroundBeams";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineCancelPresentation } from "react-icons/md";

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostData>();

  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const onSubmit = async (data: PostData) => {
    // Split the cleaned text by newline characters (both \\n and \n)
    const linesArray = data.content.split(/\r?\n/);
    setTags(linesArray);
  };

  return (
    <div className=" absolute flex justify-center z-40 backdrop-blur-[7px] w-full h-full min-w-minContent overflow-y-auto">
      <div className=" absolute z-50 mx-auto flex flex-col w-[34rem] md:w-[40rem]">
        <div onClick={() => props.setCreatePost(false)} className=" cursor-pointer self-end">
          <MdOutlineCancelPresentation className="w-11 h-8 fill-white hover:fill-slate-300 transition-all ease-in-out mt-4" />
        </div>
        {/* create post form */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full font-be-veitnam-pro flex flex-col gap-y-6 text-white">
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
          <div className=" flex flex-col w-full gap-y-1">
            <label className=" text-[1.1rem]">Media</label>

            <div
              className=" w-10/12 h-64 flex flex-col justify-center items-center self-center rounded-lg bg-neutral-950
                    hover:bg-transparent cursor-pointer transition-all duration-100 ease-in-out"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <div>Drop Files</div>
              <div>Video and Images only</div>
            </div>
          </div>
          {/* content */}
          <div className=" flex flex-col gap-y-1">
            <label className=" text-[1.1rem]">Content</label>
            <textarea {...register("content")} placeholder="Content" />
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
