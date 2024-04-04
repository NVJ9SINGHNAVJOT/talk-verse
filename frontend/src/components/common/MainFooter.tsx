import mainLogo from "@/assets/mainLogo.png"
import { FaFacebook } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { MdOutlineLocalPhone } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";

const MainFooter = () => {
  return (

    <footer className="w-full footerBackground text-white py-16 px-8">


      <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 text-white">


        <div className="flex flex-col col-span-2 ">

          <div className="flex gap-5">
            <img src={mainLogo} alt="Loading..." className=" w-16 aspect-square"></img>
            <span className=" text-2xl font-medium cursor-pointer">TalkVerse</span>
          </div>

          <p className="mt-4 max-w-[300px]">Every blog post is a journey. Start with a single step,
            a single word, and let the path unfold before you. Embrace the adventure of expression.
          </p>

          <div className="flex mt-6 gap-6">
            <FaFacebook className=" text-xl cursor-pointer" />
            <FaInstagram className=" text-xl cursor-pointer" />
            <FaXTwitter className=" text-xl cursor-pointer" />
            <FaGithub className=" text-xl cursor-pointer" />
          </div>

        </div>


        <div className="flex flex-col">

          <div className="text-lg font-medium mb-6 cursor-pointer">About Us</div>
          <p className="text-sm my-1 cursor-pointer">Company History</p>
          <p className="text-sm my-1 cursor-pointer">Meet The Team</p>
          <p className="text-sm my-1 cursor-pointer">Employee Handbook</p>
          <p className="text-sm my-1 cursor-pointer">Careers</p>

        </div>


        <div className="flex flex-col">

          <div className="text-lg font-medium mb-6 cursor-pointer">Resources</div>
          <p className="text-sm my-1 cursor-pointer">Development</p>
          <p className="text-sm my-1 cursor-pointer">Design</p>
          <p className="text-sm my-1 cursor-pointer">Adverstisment</p>
          <p className="text-sm my-1 cursor-pointer">Documentation</p>
          <p className="text-sm my-1 cursor-pointer">Downloads</p>
          <p className="text-sm my-1 cursor-pointer">Events</p>

        </div>


        <div className="flex flex-col">

          <div className="text-lg font-medium mb-6 cursor-pointer">Links</div>
          <p className="text-sm my-1 cursor-pointer">FAQs</p>
          <p className="text-sm my-1 cursor-pointer">Support</p>
          <p className="text-sm my-1 cursor-pointer">Live Chat</p>

        </div>


        <div className="flex flex-col sm:col-span-2 lg:col-span-1">

          <div className="text-lg font-medium mb-6  cursor-pointer">Contact Us</div>
          <p className="text-sm my-1 flex"><CiMail className=" text-xl cursor-pointer"/><span className="pl-2">talkverse@gmail.com</span></p>
          <p className="text-sm my-1 flex"><MdOutlineLocalPhone className=" text-xl cursor-pointer"/><span className="pl-2">0123456789</span></p>
          <p className="text-sm my-1 flex"><CiLocationOn className=" text-xl cursor-pointer"/><span className="pl-2">777 Lane, India, Earth</span></p>

        </div>


      </div>

      <hr className="h-px my-8 bg-whitesmoke border-0"></hr>

      <div className="flex justify-between">
        <p className=" text-xs font-medium">Copyright © 2024 TalkVerse · All rights reserved</p>
        <p className=" text-xs font-medium">Terms & Conditions · Privacy Policy </p>
      </div>

    </footer>
  )
}

export default MainFooter