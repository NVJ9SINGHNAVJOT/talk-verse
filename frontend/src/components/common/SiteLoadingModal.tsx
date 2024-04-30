const SiteLoadingModal = () => {
  return (
    <div className=" absolute top-[4rem] w-full h-[calc(100vh-4rem)] flex justify-center items-center z-[2000] bg-black ">
      <div
        className="p-3 animate-spin bg-gradient-to-bl from-pink-400
       via-purple-400 to-indigo-600 md:w-48 md:h-48 h-32 w-32 aspect-square rounded-full"
      >
        <div className=" text-snow-600 rounded-full h-full w-full bg-zinc-900 background-blur-md"></div>
      </div>
    </div>
  );
};

export default SiteLoadingModal;
