import SocialMediaCard from "@/lib/cards/socialmediacard/SocialMediaCard";
import aboutUs1 from "@/assets/images/about_us_1.jpg";
import aboutUs2 from "@/assets/images/about_us_2.jpg"
const About = () => {
  return (
    <div className=" w-full">
      <div className=" w-11/12 mx-auto">

        {/* section 1 */}
        <section className=" w-full mt-8 flex flex-col items-center">
          <div className="h-[0.1rem] w-full bg-black"></div>
          <div className="sm:text-7xl  lm:text-9xl font-serif  py-2">About Us</div>
          <div className="h-[0.1rem] w-full bg-black"></div>

          <div className="flex justify-between w-full mt-10 sm:gap-x-12 lm:gap-x-[5rem]">
            <div className=" font-mono text-red-500 font-semibold text-nowrap text-xl">
              OUR VALUES
            </div>
            <div className=" flex flex-col">
              <div className="uppercase font-mono font-bold ">
                Talkiverse: a unique social media platform, serves as a global bridge connecting users from all corners of the world.
                Through its innovative features, Talkiverse enables genuine interactions and fosters connections among people with shared interests.
              </div>
              <div className=" mt-2 flex gap-x-8">
                <div className=" text-snow-700">FOUNDED: 22/04/2024</div>
                <div className=" text-snow-700">INDIA | EARTH</div>
              </div>
            </div>
          </div>

          <div className=" w-full sm:h-[270px] lm:h-[400px] rounded-[10px] p-10 bg-[lightgrey] flex justify-between mt-16
            [box-shadow:rgba(50,_50,_93,_0.25)_0px_30px_50px_-12px_inset,_rgba(0,_0,_0,_0.3)_0px_18px_26px_-18px_inset]
             hover:bg-[#e0e0e0] hover:[box-shadow:15px_15px_30px_#bebebe,_-15px_-15px_30px_#ffffff]
            transition-all ease-in-out "
          >
            <img src={aboutUs1} alt="Loading..." className=" w-5/12 aspect-auto " ></img>
            <img src={aboutUs2} alt="Loading..." className=" w-5/12 aspect-auto " ></img>
          </div>

        </section>

        {/* section 2 */}
        <section className="w-full flex flex-col mt-28">

          <div className="flex justify-between w-full sm:gap-x-12 lm:gap-x-[5rem]">
            <div className=" font-mono text-red-500 font-semibold text-nowrap text-xl">
              OUR MISSION
            </div>

            <div className=" flex flex-col">
              <div className="uppercase font-mono font-bold ">
                Whether you're a fan seeking to engage with your favorite artists or simply looking to make new friends,
                Talkiverse provides a seamless experience. By breaking down language barriers, users can engage in private chats,
                discussions, and collaborative endeavors with individuals from diverse backgrounds. As you explore Talkiverse, you'll
                find a universe of possibilities, where conversations transcend borders and create a vibrant global community.
              </div>
              <div className=" mt-6 ">
                In an era where digital landscapes evolve at warp speed, Talkverse emerges as a beacon of connectivity,
                transcending geographical boundaries and cultural divides. This innovative social media platform leverages
                cutting-edge technologies to redefine how we interact, collaborate, and explore.
              </div>
              <ul className=" flex flex-col mt-8 ml-6 gap-y-4">
                <li>
                  <span className=" font-bold">The Metaverse Unleashed:</span> Talkverse isn't just another app; it's a gateway to the metaverse.
                  Augmented reality (AR) and virtual reality (VR) converge seamlessly, blurring the lines between physical and digital realms.
                  Users step into immersive environments, attending virtual events, exploring 3D spaces, and interacting with lifelike avatars.
                </li>
                <li>
                  <span className=" font-bold">Cloud-Powered Conversations:</span> The backbone of Talkverse lies in cloud computing.
                  Scalable, secure, and lightning-fast, the cloud ensures uninterrupted conversations. Whether you're sharing photos,
                  streaming live video, or collaborating on projects, the cloud keeps data flowing seamlessly.
                </li>
                <li>
                  <span className=" font-bold">Privacy and Personalization:</span> Talkverse prioritizes user privacy.
                  Advanced encryption safeguards conversations, while decentralized identity management ensures control over personal data.
                  Users curate their digital personas, choosing what to share and with whom.
                </li>
                <li>
                  <span className=" font-bold">From Social to Spatial:</span> Beyond profiles and posts, Talkverse introduces spatial
                  interactions. Attend virtual concerts, explore art galleries, or collaborate on 3D designs. The world becomes your canvas.
                </li>
              </ul>
            </div>
          </div>

        </section>

        {/* section 3 */}
        <section className=" w-full flex flex-col items-center mt-28">
          <div className=" sm:text-7xl lm:text-9xl font-serif  py-2 ">Our Clients</div>

          <div className=" mt-6">

          </div>
        </section>

        <SocialMediaCard />

      </div>
    </div>
  );
};

export default About;