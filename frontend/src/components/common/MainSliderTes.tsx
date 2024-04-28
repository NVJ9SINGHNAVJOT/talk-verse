import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import { RxAvatar } from "react-icons/rx";

type TesData = {
  review: string;
};

const MainSliderTes = () => {
  const data = [
    "A Digital Tapestry of Voices. Where connections bloom, effortlessly. Genuine interactions nurture lasting relationships.",
    "Authentic Bonds Flourish. Diverse minds unite. From tech enthusiasts to poets, sparks of creativity ignite.",
    "Intuitive Navigation. Seamless interface. Focus on meaningful conversations within Talkverse.",
    "Amplifying Voices. Insights resonate. Empowering users to share and be heard.",
    "A Sanctuary for Positivity. Encouragement flows freely, uplifting spirits. A safe haven in the digital realm.",
    "Where Creativity Blossoms. Artists, writers, and dreamers unite. Talkverse fuels inspiration and expression.",
    "Daily Debates and Insights. Thought-provoking discussions ignite. Minds collide, shaping new perspectives.",
    "Privacy with No Compromises. Top-notch features safeguard data. Trust Talkverse for secure connections.",
    "A Sense of Belonging. Talkverse becomes your digital home. Heartfelt connections thrive here.",
    "Empowering Conversations. Where words matter, where voices amplify. Join Talkverse and be part of the narrative.",
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
      {data.map((value: string, index) => (
        <SwiperSlide key={index}>
          <div className="w-full h-full flex flex-col justify-evenly items-center p-2">
            {/* only edit content in this div */}
            <div className=" text-white">{value}</div>
            <div className=" self-start flex items-center text-white gap-4">
              <RxAvatar className=" w-16 h-16 " />
              <div>Navjot Singh</div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default MainSliderTes;
