import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import { RxAvatar } from "react-icons/rx";

type TesData = {
  review: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
};

const MainSliderTes = () => {
  const data: TesData[] = [
    {
      review:
        "A Digital Tapestry of Voices. Where connections bloom, effortlessly. Genuine interactions nurture lasting relationships.",
      firstName: "Navjot",
      lastName: "Singh",
    },
    {
      review:
        "Authentic Bonds Flourish. Diverse minds unite. From tech enthusiasts to poets, sparks of creativity ignite.",
      firstName: "Navjot",
      lastName: "Singh",
    },
    {
      review:
        "Intuitive Navigation. Seamless interface. Focus on meaningful conversations within Talkverse.",
      firstName: "Navjot",
      lastName: "Singh",
    },
    {
      review:
        "Amplifying Voices. Insights resonate. Empowering users to share and be heard.",
      firstName: "Navjot",
      lastName: "Singh",
    },
  ];

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
      {data.map((value: TesData, index) => (
        <SwiperSlide key={index}>
          <div className="w-full h-full flex flex-col justify-evenly items-center p-2">
            {/* only edit content in this div */}
            <div className=" text-white sm:text-xs md:text-[1rem] ">
              {value.review}
            </div>
            <div className=" self-start flex items-center text-white gap-4">
              {value.imageUrl ? (
                <img
                  className="sm:w-10 sm:h-10 lm:w-16 lm:h-16 aspect-auto rounded-full"
                  alt="Loading..."
                />
              ) : (
                <RxAvatar className="sm:w-10 sm:h-10 lm:w-16 lm:h-16" />
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
