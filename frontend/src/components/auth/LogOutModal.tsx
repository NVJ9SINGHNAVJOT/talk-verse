type LogOutModalPros = {
  setTogLogO: React.Dispatch<React.SetStateAction<boolean>>;
};

const LogOutModal = (props: LogOutModalPros) => {
  const logOut = () =>{
    
  }
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 flex justify-center items-center gap-10 overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <button className="text-white bg-black h-[3rem] w-fit px-4 rounded-md">
        Log Out
      </button>
      <button
        onClick={() => {
          props.setTogLogO(false);
        }}
        className="relative inline-flex h-[3rem] w-fit items-center justify-center rounded-md
         bg-white px-4 font-medium text-gray-950 transition-colors focus:outline-none focus:ring-2
          focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50"
      >
        <div
          className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe]
           to-[#8678f9] opacity-75 blur"
        />
        Cancel
      </button>
    </div>
  );
};

export default LogOutModal;
