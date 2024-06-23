import aboutUs1 from "@/assets/images/about_us_1.jpg";
import aboutUs2 from "@/assets/images/about_us_2.jpg";
import MainFooter from "@/components/common/MainFooter";
import client1 from "@/assets/images/client1.jpg";
import client2 from "@/assets/images/client2.jpg";
import ReadMoreButton from "@/lib/buttons/readmorebutton/ReadMoreButton";
import MainSliderTes from "@/components/common/MainSliderTes";
import useCountOnView from "@/hooks/useCountOnView";
import { useState, useRef } from "react";

const About = () => {
  const [userCount, setUserCount] = useState<number>(0);
  const countRef = useRef<HTMLDivElement>(null);

  // Use the custom hook
  useCountOnView(countRef, setUserCount);
  return (
    <div className=" w-full">
      <div className=" w-10/12 mx-auto mb-20">
        {/* section 1 */}
        <section className=" w-full mt-8 flex flex-col items-center">
          <div className="h-[0.1rem] w-full bg-black"></div>
          <div className="text-7xl  lm:text-9xl font-be-veitnam-pro py-2 font-bold">ABOUT US</div>
          <div className="h-[0.1rem] w-full bg-black"></div>
          <div className="flex justify-between w-full mt-10 gap-x-12 lm:gap-x-[5rem]">
            <div className=" font-roboto-condensed text-red-500 font-semibold text-nowrap text-xl">OUR VALUES</div>
            <div className=" flex flex-col">
              <div className="uppercase font-roboto-condensed font-bold ">
                Talkiverse: a unique social media platform, serves as a global bridge connecting users from all corners
                of the world. Through its innovative features, Talkiverse enables genuine interactions and fosters
                connections among people with shared interests.
              </div>
              <div className=" mt-2 flex gap-x-8">
                <div className=" text-snow-700">FOUNDED: 22/04/2024</div>
                <div className=" text-snow-700">INDIA | EARTH</div>
              </div>
            </div>
          </div>
          <div
            className=" w-full rounded-[10px] p-10 bg-[lightgrey] flex justify-around mt-16
            [box-shadow:rgba(50,_50,_93,_0.25)_0px_30px_50px_-12px_inset,_rgba(0,_0,_0,_0.3)_0px_18px_26px_-18px_inset]
             hover:bg-[#e0e0e0] hover:[box-shadow:15px_15px_30px_#bebebe,_-15px_-15px_30px_#ffffff]
            transition-all ease-in-out py-10 lm:py-20"
          >
            <img src={aboutUs1} alt="Loading..." className=" w-5/12 aspect-auto object-contain"></img>
            <img src={aboutUs2} alt="Loading..." className=" w-5/12 aspect-auto object-contain"></img>
          </div>
        </section>
        {/* section 2 */}
        <section className="w-full flex flex-col mt-28">
          <div className="flex justify-between w-full gap-x-12 lm:gap-x-[5rem]">
            <div className=" font-roboto-condensed  text-red-500 font-semibold text-nowrap text-xl">OUR MISSION</div>
            <div className=" flex flex-col">
              <div className="uppercase font-roboto-condensed font-bold ">
                Whether you're a fan seeking to engage with your favorite artists or simply looking to make new friends,
                Talkiverse provides a seamless experience. By breaking down language barriers, users can engage in
                private chats, discussions, and collaborative endeavors with individuals from diverse backgrounds. As
                you explore Talkiverse, you'll find a universe of possibilities, where conversations transcend borders
                and create a vibrant global community.
              </div>
              <div className=" mt-6 ">
                In an era where digital landscapes evolve at warp speed, Talkverse emerges as a beacon of connectivity,
                transcending geographical boundaries and cultural divides. This innovative social media platform
                leverages cutting-edge technologies to redefine how we interact, collaborate, and explore.
              </div>
              <ul className=" flex flex-col mt-8 ml-6 gap-y-4">
                <li>
                  <span className=" font-bold">The Metaverse Unleashed:</span> Talkverse isn't just another app; it's a
                  gateway to the metaverse. Augmented reality (AR) and virtual reality (VR) converge seamlessly,
                  blurring the lines between physical and digital realms. Users step into immersive environments,
                  attending virtual events, exploring 3D spaces, and interacting with lifelike avatars.
                </li>
                <li>
                  <span className=" font-bold">Cloud-Powered Conversations:</span> The backbone of Talkverse lies in
                  cloud computing. Scalable, secure, and lightning-fast, the cloud ensures uninterrupted conversations.
                  Whether you're sharing photos, streaming live video, or collaborating on projects, the cloud keeps
                  data flowing seamlessly.
                </li>
                <li>
                  <span className=" font-bold">Privacy and Personalization:</span> Talkverse prioritizes user privacy.
                  Advanced encryption safeguards conversations, while decentralized identity management ensures control
                  over personal data. Users curate their digital personas, choosing what to share and with whom.
                </li>
                <li>
                  <span className=" font-bold">From Social to Spatial:</span> Beyond profiles and posts, Talkverse
                  introduces spatial interactions. Attend virtual concerts, explore art galleries, or collaborate on 3D
                  designs. The world becomes your canvas.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
      {/* section 3 */}
      <div className="text-7xl lm:text-9xl font-be-veitnam-pro text-center -mb-2  lm:-mb-4 text-somke">Our Clients</div>
      <section className="w-full  bg-somke py-20">
        <div className="w-10/12 mx-auto flex flex-col my-12 gap-y-36">
          {/* client 1 */}
          <div
            style={{ backgroundImage: `url(${client1})` }}
            className=" self-start group relative h-[20rem] lm:h-[25rem] lg:h-[28rem] xl:h-[30rem] w-9/12 flex flex-col justify-center 
            items-center [background-size:100%_100%] bg-no-repeat shadow-[0px_0px_40px_#1f1f1f]
            before:absolute before:top-[0] before:left-[0] before:right-[0] before:bottom-[0] 
            before:bg-[linear-gradient(45deg,_#343d68,_#343d68be,_#343d687c)] before:scale-x-0 before:origin-left
            before:transition-all before:duration-[0.4s] hover:before:scale-100"
          >
            <div
              className=" w-7/12 h-full flex flex-col justify-center gap-10 text-white opacity-0 group-hover:opacity-100 
              group-hover:scale-125 transition-all duration-[0.4s]"
            >
              <p className=" text-2xl">DRONZER TECH</p>
              <p className=" text-xs ">
                TalkVerse, a private messaging app, connects people to find new friends and engage in conversations.
                Developed by Dronzer Tech, it fosters connections and facilitates meaningful interactions.
              </p>
              <ReadMoreButton />
            </div>
          </div>
          {/* client 2 */}
          <div
            style={{ backgroundImage: `url(${client2})` }}
            className=" self-end group relative h-[20rem] lm:h-[25rem] lg:h-[28rem] xl:h-[30rem] w-9/12 flex flex-col 
            justify-center items-center [background-size:100%_100%] bg-no-repeat shadow-[0px_0px_40px_#1f1f1f]
            before:absolute before:top-[0] before:left-[0] before:right-[0] before:bottom-[0] 
            before:bg-[linear-gradient(45deg,_#343d68,_#343d68be,_#343d687c)] before:scale-x-0 before:origin-right
            before:transition-all before:duration-[0.4s] hover:before:scale-100"
          >
            <div
              className=" w-7/12 h-full flex flex-col justify-center gap-10 text-white opacity-0 group-hover:opacity-100 
              group-hover:scale-125 transition-all duration-[0.4s]"
            >
              <p className=" text-2xl">CODE ZONE</p>
              <p className=" text-xs ">
                Code Zone, as the client for TalkVerse, collaborates closely with the development team to shape the
                app's features, user experience, and overall vision. Their input drives the app's evolution.
              </p>
              <ReadMoreButton />
            </div>
          </div>
        </div>
      </section>
      {/* testimonials section */}
      <section
        className=" w-full h-[50rem] bg-[rgb(9,29,47)] 
        bg-[linear-gradient(207deg,_rgba(7,18,25,1)_35%,_rgba(16,54,91,1)_59%,_rgba(7,21,34,1)_80%)]
        flex flex-col justify-center gap-y-16 items-center"
      >
        <div className=" flex flex-col items-center text-white [&>*:not(:last-child)]:font-bold font-be-veitnam-pro text-3xl">
          <div>Don't take our word for it.</div>
          <div className=" flex gap-x-2 mt-4 justify-end items-baseline">
            <div>Over</div>
            <div className="w-[6rem] text-center text-5xl [text-shadow:0_0_5px_#59deed]" ref={countRef}>
              {userCount}+
            </div>
            <div>Million people trust us.</div>
          </div>
          <div
            className=" py-2 px-4 mt-8 rounded-2xl w-fit text-xs border-[1px]
            border-snow-500 bg-[linear-gradient(0deg,_rgba(7,18,25,1)_99%,_rgba(19,70,119,1)_100%)] text-white"
          >
            Testimonials
          </div>
        </div>
        <MainSliderTes />
      </section>
      {/* footer */}
      <MainFooter />
    </div>
  );
};

export default About;
