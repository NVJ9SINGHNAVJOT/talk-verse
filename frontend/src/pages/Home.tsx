import TileShadowCard from "@/components/cards/tileshadowcard/TileShadowCard";
import homePageImage from "@/assets/homePage.png"
import TrackingCard from "@/components/cards/trackingcard/TrackingCard";
import Footer from "@/components/common/Footer";


const Home = () => {
  return (
    <div className="w-full  bg-grayblack">

      <section className="w-full flex justify-evenly items-center pt-28 pb-28">

        <TileShadowCard />

        <img src={homePageImage} alt="Home Page Image Loading..." className=" w-[25rem] aspect-square">
        </img>
      </section>


      <section className="w-full flex justify-evenly items-center">

        <TrackingCard/>

      </section>


      <Footer/>

    </div>
  )
}

export default Home;