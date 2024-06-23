const SiteLoadingModal = () => {
  return (
    <div className="z-[2000] flex flex-col">
      <div
        className="relative bg-[radial-gradient(circle_at_24.1%_68.8%,_rgb(50,_50,_50)_0%,_rgb(0,_0,_0)_99.4%)]
      h-[4rem] flex justify-between items-center w-full"
      ></div>
      <div className="top-[4rem] w-full h-[calc(100vh-4rem)] flex justify-center items-center bg-black ">
        <div
          className="p-3 animate-spin bg-gradient-to-bl from-pink-400
       via-purple-400 to-indigo-600 md:w-48 md:h-48 h-32 w-32 aspect-square rounded-full"
        >
          <div className=" text-snow-600 rounded-full h-full w-full bg-zinc-900 background-blur-md"></div>
        </div>
      </div>
    </div>
  );
};

export default SiteLoadingModal;
