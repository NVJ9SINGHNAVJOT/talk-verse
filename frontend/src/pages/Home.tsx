import TileShadowCard from "@/components/cards/tileshadowcard/TileShadowCard";
import homePageImage from "@/assets/homePage.png"
import TrackingCard from "@/components/cards/trackingcard/TrackingCard";
import MainFooter from "@/components/common/MainFooter";


const Home = () => {
  return (
    <div className="w-full bg-grayblack">

      <section className="w-full flex justify-evenly items-center pt-28 pb-28">

        <TileShadowCard />

        <img src={homePageImage} alt="Home Page Image Loading..." className=" w-[25rem] aspect-square">
        </img>
      </section>


      <section className="w-full flex justify-evenly items-center pt-8 py-36">

        <TrackingCard/>

      </section>


      <MainFooter/>

    </div>
  )
}

export default Home;