import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import { cn } from "@/utils/cn";
import { type FileUrl } from "@/components/core/blog/post/CreatePost";

type MediaFilesProps = {
  mediaUrls: FileUrl[] | string[];
  className?: string;
};

const MediaFiles = (props: MediaFilesProps) => {
  return (
    <div className={cn(props.className)}>
      <Swiper pagination={true} navigation={true} modules={[Pagination, Navigation]} className="mySwiper w-full h-full">
        {props.mediaUrls.map((file, index) => {
          return (
            <SwiperSlide key={index}>
              {typeof file === "string" ? (
                // mediaUrls are array of string
                <div className="w-full h-full flex justify-center items-center">
                  {file.includes("image") ? (
                    <img alt="Loading..." src={file} className=" max-w-full max-h-full w-auto aspect-auto" />
                  ) : (
                    <video src={file} controls className=" max-w-full max-h-full w-auto aspect-auto" />
                  )}
                </div>
              ) : (
                // mediaUrls are array of FileUrl
                <div className="w-full h-full flex justify-center items-center">
                  {file.type === "image" ? (
                    <img alt="Loading..." src={file.url} className=" max-w-full max-h-full w-auto aspect-auto" />
                  ) : (
                    <video src={file.url} controls className=" max-w-full max-h-full w-auto aspect-auto" />
                  )}
                </div>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default MediaFiles;
