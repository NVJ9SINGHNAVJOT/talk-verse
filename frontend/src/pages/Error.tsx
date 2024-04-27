const Error = () => {
  return (
    <div className="w-full flex bg-grayblack h-[calc(100vh-4rem)] justify-around items-center">
      <p className="text-6xl md:text-7xl lg:text-[12rem] font-bold tracking-wider text-white">
        404
      </p>

      <div className=" text-white flex flex-col items-center">
        <h2 className="my-2  font-bold text-2xl">
          Looks like you've found the doorway to the great nothing
        </h2>
        <p className="my-2 ">
          Sorry about that! Please visit our hompage to get where you need to
          go.
        </p>
        <button
          className="sm:w-full lg:w-auto mt-16 border rounded md py-4 px-8 text-center
          hover:text-black hover:bg-white transition-all ease-in-out"
        >
          Take me there!
        </button>
      </div>
    </div>
  );
};

export default Error;
