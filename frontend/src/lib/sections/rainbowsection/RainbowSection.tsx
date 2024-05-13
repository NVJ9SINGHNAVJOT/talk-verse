import "@/lib/sections/rainbowsection/RainbowSection.css";

const RainbowSection = () => {
  return (
    <section className=" ct-rainbow w-full h-[45rem] flex flex-col items-center justify-center">
      <div
        className="ct-rainbowHeading font-be-veitnam-pro text-8xl font-extrabold
    mix-blend-difference text-white brightness-[900]
    filter"
      >
        TalkVerse
      </div>
    </section>
  );
};

export default RainbowSection;
