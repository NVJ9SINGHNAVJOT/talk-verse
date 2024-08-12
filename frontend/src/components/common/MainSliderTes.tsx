import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import { RxAvatar } from "react-icons/rx";
import { useEffect } from "react";
import { useAppSelector } from "@/redux/store";
import { getReviewsApi } from "@/services/operations/reviewApi";
import { reviewsSliceObject, setReviews } from "@/redux/slices/reviewsSlice";
import { useDispatch } from "react-redux";

const MainSliderTes = () => {
  const reviews = useAppSelector((state) => state.reviews.reviews);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (reviewsSliceObject.reviewApiEnd === true) {
        return;
      }
      reviewsSliceObject.reviewApiEnd = true;
      const response = await getReviewsApi();
      if (response && response.reviews.length > 0) {
        dispatch(setReviews(response.reviews));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // only give width and height to swiper (main container)
    <Swiper
      effect={"coverflow"}
      loop={true}
      grabCursor={true}
      centeredSlides={true}
      slidesPerView={3}
      coverflowEffect={{
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      }}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      modules={[EffectCoverflow, Pagination, Autoplay]}
      className="mySwiper w-full h-[20rem] py-8"
    >
      {reviews.map((value, index) => (
        <SwiperSlide key={index}>
          <div className="w-full h-full flex flex-col justify-evenly items-center p-2">
            {/* only edit content in this div */}
            <div className=" text-white text-xs md:text-[1rem] ">{value.reviewText}</div>
            <div className=" self-start flex items-center text-white gap-4">
              {value.imageUrl ? (
                <img
                  src={value.imageUrl}
                  className="w-10 h-10 lm:w-16 lm:h-16 object-cover rounded-full"
                  alt="Loading..."
                />
              ) : (
                <RxAvatar className="w-10 h-10 lm:w-16 lm:h-16" />
              )}
              <div>
                <span>{value.firstName}</span> <span>{value.lastName}</span>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default MainSliderTes;
