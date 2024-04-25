import TileShadowCard from "@/lib/cards/tileshadowcard/TileShadowCard";
import homePageImage from "@/assets/homePage.png";
import TrackingCard from "@/lib/cards/trackingcard/TrackingCard";
import MainFooter from "@/components/common/MainFooter";


const Home = () => {
  return (
    <div className="w-full bg-grayblack">

      <section className="w-full flex flex-col gap-y-16 lm:flex-row lm:gap-y-0 justify-evenly items-center pt-28 pb-28">
        <TileShadowCard />
        <img src={homePageImage} alt="Home Page Image Loading..." className="w-[25rem] aspect-square">
        </img>
      </section>

      <section className="w-full flex justify-evenly items-center pt-8 py-36">
        <TrackingCard/>
      </section>

      <MainFooter/>

    </div>
  );
};

export default Home;