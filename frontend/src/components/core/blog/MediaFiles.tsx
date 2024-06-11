import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import { cn } from "@/utils/cn";

type MediaFilesProps = {
  mediaUrls: string[];
  className?: string;
};

const MediaFiles = (props: MediaFilesProps) => {
  return (
    <div className={cn(props.className)}>
      <Swiper pagination={true} navigation={true} modules={[Pagination, Navigation]} className="mySwiper w-full h-full">
        {props.mediaUrls.map((url, index) => {
          return (
            <SwiperSlide key={index}>
              <div className="w-full h-full flex justify-center">
                <img alt="Loading..." src={url} className=" max-w-full max-h-full w-auto aspect-auto" />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default MediaFiles;
