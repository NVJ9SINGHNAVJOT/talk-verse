import mainLogo from "@/assets/mainLogo.png"

const MainFooter = () => {
  return (

    <footer className="w-full footerBackground px-10 py-16 flex justify-between">


        <div className="flex flex-col">
          <p className="text-2xl font-semibold text-white">
            TalkVerse
          </p>
          <img src={mainLogo} alt="Loading..." className=" w-[6rem] aspect-square pt-4">
          </img>
        </div>


        <div className=" flex flex-col  justify-center">
          <p className="text-sm font-medium text-white">
            Resources
          </p>


          <p className="text-gray-400 font-semibold text-whitesmoke">
            Development
          </p>
          <p className="text-gray-400 font-semibold text-whitesmoke">
            Development
          </p>
          <p className="text-gray-400 font-semibold text-whitesmoke">
            Development
          </p>
          <p className="text-gray-400 font-semibold text-whitesmoke">
            Development
          </p>
        </div>


        <div className=" flex flex-col  justify-center">
          <p className="text-sm font-medium text-white">
            Resources
          </p>


          <p className="text-gray-400 font-semibold text-whitesmoke">
            Development
          </p>
          <p className="text-gray-400 font-semibold text-whitesmoke">
            Development
          </p>
          <p className="text-gray-400 font-semibold text-whitesmoke">
            Development
          </p>
          <p className="text-gray-400 font-semibold text-whitesmoke">
            Development
          </p>
        </div>


        <div className=" flex flex-col  justify-center">
          <p className="text-sm font-medium text-white">
            Resources
          </p>


          <p className="text-gray-400 font-semibold text-whitesmoke">
            Development
          </p>
          <p className="text-gray-400 font-semibold text-whitesmoke">
            Development
          </p>
          <p className="text-gray-400 font-semibold text-whitesmoke">
            Development
          </p>
          <p className="text-gray-400 font-semibold text-whitesmoke">
            Development
          </p>
        </div>



    </footer>
  )
}

export default MainFooter