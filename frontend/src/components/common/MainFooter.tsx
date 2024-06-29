import { FaFacebook } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { MdOutlineLocalPhone } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const MainFooter = () => {
  const navigate = useNavigate();
  const homeHandler = () => {
    navigate("/");
  };

  return (
    <footer
      className="w-full text-white py-16 px-8 
      bg-[linear-gradient(315deg,_rgba(21,_0,_36,_1)_66%,_rgba(147,_147,_147,_1)_100%,_rgba(0,_212,_255,_1)_100%)]"
    >
      {/* main content */}
      <div className="w-full grid grid-cols-5 md:grid-cols-6 gap-x-4 lg:gap-0 gap-y-8 text-white mx-auto">
        {/* logo and main description */}
        <div className="flex flex-col col-span-3 lg:col-span-2 ">
          <div className="flex gap-5">
            <img src="images/mainLogo.png" alt="Loading..." className=" w-16 aspect-square"></img>
            <span onClick={homeHandler} className=" text-2xl font-medium cursor-pointer">
              TalkVerse
            </span>
          </div>
          <p className="mt-4 max-w-[300px]">
            Every blog post is a journey. Start with a single step, a single word, and let the path unfold before you.
            Embrace the adventure of expression.
          </p>
          <div className="flex mt-6 gap-6">
            <FaFacebook className=" text-xl cursor-pointer" />
            <FaInstagram className=" text-xl cursor-pointer" />
            <FaXTwitter className=" text-xl cursor-pointer" />
            <FaGithub className=" text-xl cursor-pointer" />
          </div>
        </div>

        {/* headings and subheadings */}
        <div className="flex flex-col">
          <div className="text-lg font-medium mb-6 cursor-pointer w-fit">About Us</div>
          <p className="text-sm my-1 cursor-pointer w-fit">Company History</p>
          <p className="text-sm my-1 cursor-pointer w-fit">Meet The Team</p>
          <p className="text-sm my-1 cursor-pointer w-fit">Employee Handbook</p>
          <p className="text-sm my-1 cursor-pointer w-fit">Careers</p>
        </div>

        <div className="flex flex-col">
          <div className="text-lg font-medium mb-6 cursor-pointer w-fit">Resources</div>
          <p className="text-sm my-1 cursor-pointer w-fit">Development</p>
          <p className="text-sm my-1 cursor-pointer w-fit">Design</p>
          <p className="text-sm my-1 cursor-pointer w-fit">Adverstisment</p>
          <p className="text-sm my-1 cursor-pointer w-fit">Documentation</p>
          <p className="text-sm my-1 cursor-pointer w-fit">Downloads</p>
          <p className="text-sm my-1 cursor-pointer w-fit">Events</p>
        </div>

        <div className="flex flex-col">
          <div className="text-lg font-medium mb-6 cursor-pointer w-fit">Links</div>
          <p className="text-sm my-1 cursor-pointer w-fit">FAQs</p>
          <p className="text-sm my-1 cursor-pointer w-fit">Support</p>
          <p className="text-sm my-1 cursor-pointer w-fit">Live Chat</p>
        </div>

        <div className="flex flex-col col-span-2 lg:col-span-1">
          <div className="text-lg font-medium mb-6 cursor-pointer w-fit">Contact Us</div>
          <p className="text-sm my-1 flex">
            <CiMail className=" text-xl cursor-pointer" />
            <span className="pl-2">talkverse@gmail.com</span>
          </p>
          <p className="text-sm my-1 flex">
            <MdOutlineLocalPhone className=" text-xl cursor-pointer" />
            <span className="pl-2">0123456789</span>
          </p>
          <p className="text-sm my-1 flex">
            <CiLocationOn className=" text-xl cursor-pointer" />
            <span className="pl-2">777 Lane, India, Earth</span>
          </p>
        </div>
      </div>

      {/* bottom description part */}
      <hr className="h-px my-8 bg-whitesmoke border-0"></hr>
      <div className="flex justify-between">
        <p className=" text-xs font-medium">Copyright © 2024 TalkVerse · All rights reserved</p>
        <p className=" text-xs font-medium">Terms & Conditions · Privacy Policy </p>
      </div>
    </footer>
  );
};

export default MainFooter;
