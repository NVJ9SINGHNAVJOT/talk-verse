import TrackingCard from "@/lib/cards/trackingcard/TrackingCard";
import MainFooter from "@/components/common/MainFooter";
import { FcConferenceCall } from "react-icons/fc";
import RainbowSection from "@/lib/sections/rainbowsection/RainbowSection";
import StarsSection from "@/lib/sections/starssection/StarsSection";

const Home = () => {
  return (
    <div className="w-full bg-grayblack">
      <RainbowSection />
      <section className="w-full flex flex-col gap-y-16 lm:flex-row lm:gap-y-0 justify-evenly items-center pt-28 pb-28">
        <div
          className="w-8/12 h-[25rem] lm:w-5/12 text-white flex flex-col justify-center items-center
            rounded-[30px] bg-[#212121] [box-shadow:15px_15px_30px_rgb(25,_25,_25),_-15px_-15px_30px_rgb(60,_60,_60)]"
        >
          <p className=" text-center p-4 text-xl lg:text-2xl font-bold tracking-tight text-white">
            <span>
              <FcConferenceCall className=" inline-block aspect-square w-10" />
            </span>
            TalkVerse : Connecting Conversations
          </p>
          <br />
          <p className=" text-center p-4 text-lg">
            Discover a world of real-time communication with TalkVerse! Whether you're catching up with friends, sharing
            your thoughts, or meeting new people, our platform makes it seamless. Crafted with simplicity in mind,
            TalkVerse lets you chat privately
          </p>
        </div>
        <img src="images/homePage.png" alt="Loading..." className="w-[25rem] aspect-square"></img>
      </section>
      <section className="w-full flex justify-evenly items-center pt-8 py-36">
        <TrackingCard />
      </section>
      {/* stars */}
      <section className=" w-full">
        <StarsSection />
      </section>
      {/* footer */}
      <MainFooter />
    </div>
  );
};

export default Home;
