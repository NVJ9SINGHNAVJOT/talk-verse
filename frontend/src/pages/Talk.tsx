import ChatBar from "@/components/talk/UserChatBar"
import { Outlet } from "react-router-dom"

const Talk = () => {

  

  return (
    <div className="w-full flex bg-grayblack h-[calc(100vh-4rem)]">

      {/* left bar chat list section*/}
      <section className="w-4/12 h-full">
        <ChatBar/>
      </section>


      {/* right bar chat main section */}
      <section className="w-8/12 h-full">

        <Outlet/>

      </section>

      {/* starting display for chat */}

    </div>
  )
}

export default Talk