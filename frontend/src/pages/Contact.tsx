import MainFooter from "@/components/common/MainFooter";
import SendQerryButton from "@/lib/buttons/sendquerrybutton/SendQerryButton";
import LettersPull from "@/lib/cards/LettersPull";
import {
  TextRevealCard,
  TextRevealCardDescription,
  TextRevealCardTitle,
} from "@/lib/cards/TextRevealCard";
import { BackgroundBeams } from "@/lib/sections/BackgroundBeams";
import { useForm } from "react-hook-form";
import { FaFacebook, FaInstagram, FaXTwitter, FaGithub } from "react-icons/fa6";

type ContactUs = {
  fullName: string;
  email: string;
  text: string;
};

const Contact = () => {
  const { register, handleSubmit, reset } = useForm<ContactUs>();

  const sendQerry = async (data: ContactUs) => {
    reset();
  };
  return (
    <div className="w-full pt-10 bg-neutral-950  ">
      <LettersPull className="text-white " words={"Contact Us"} delay={0.05} />
      {/* heading section */}
      <section className=" w-full flex flex-col lm:flex-row items-center gap-y-16 justify-evenly mt-8">
        <div className="">
          <TextRevealCard
            text="You know the business"
            revealText="I know the chemistry "
          >
            <TextRevealCardTitle>
              Sometimes, you just need to see it.
            </TextRevealCardTitle>
            <TextRevealCardDescription>
              Get in Touch with Us At Talkverse, we value your feedback,
              inquiries, and suggestions. Whether you have a question about our
              services, want to collaborate, or simply want to say hello, we're
              here to listen. Feel free to reach out to us through the contact
              form below, or connect with us on social media. We appreciate your
              interest in Talkverse and look forward to hearing from you!
            </TextRevealCardDescription>
          </TextRevealCard>
        </div>
        <div
          className=" relative w-48 h-[20rem] group bg-[linear-gradient(163deg,_#00ff75_0%,_#3700ff_100%)] rounded-[20px] transition-all duration-300
          hover:[box-shadow:0px_0px_30px_1px_rgba(0,_255,_117,_0.30)]"
        >
          <div className=" z-50 bg-transparent absolute w-full h-full flex gap-6 flex-col items-center justify-evenly ">
            <FaFacebook className=" size-7 fill-white cursor-pointer " />
            <FaInstagram className=" size-7 fill-white cursor-pointer " />
            <FaXTwitter className=" size-7 fill-white cursor-pointer " />
            <FaGithub className=" size-7 fill-white cursor-pointer " />
          </div>
          <div
            className=" w-full h-full bg-[#1a1a1a] rounded-[18px] transition-all duration-300 group-hover:scale-[0.97]
             group-hover:rounded-[20px]  "
          ></div>
        </div>
      </section>
      {/* form section */}
      <section className=" w-full h-[45rem]">
        <div className="w-full h-full rounded-md relative flex flex-col items-center justify-center antialiased">
          <div className="max-w-2xl mx-auto p-4 flex flex-col items-center">
            <h1
              className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b
             from-neutral-200 to-neutral-600  text-center font-sans font-bold"
            >
              Send Your Querry
            </h1>
            <p></p>
            <p className="text-neutral-500 max-w-lg mx-auto my-2 text-xl text-center relative z-10">
              Our team will contact you asap
            </p>
            <div className="relative h-80  w-96 mt-7 flex justify-center">
              <form
                onSubmit={handleSubmit(sendQerry)}
                className=" w-full absolute font-be-veitnam-pro flex flex-col text-white z-50"
              >
                <label className="mb-1">Full Name</label>
                <input
                  className=" mb-4 outline-none text-black rounded-lg p-1 bg-snow-600 focus:bg-transparent
                   focus:text-white transition-all ease-in-out duration-100"
                  {...register("fullName", {
                    required: true,
                    pattern: /^[a-zA-Z]{2,}$/,
                  })}
                  placeholder="Full Name"
                />
                <label className=" mb-1">Email</label>
                <input
                  className=" mb-4 outline-none text-black rounded-lg p-1 bg-snow-600 focus:bg-transparent
                   focus:text-white transition-all ease-in-out duration-100"
                  {...register("email", {
                    required: true,
                    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  })}
                  placeholder="Email"
                />
                <label className=" mb-1">Message</label>
                <textarea
                  className="  outline-none h-32 resize-none text-black rounded-lg p-1 bg-snow-600 focus:bg-transparent
                   focus:text-white transition-all ease-in-out duration-100"
                  {...register("text", {
                    required: true,
                    minLength: 1,
                    maxLength: 250,
                  })}
                  placeholder="Message"
                  maxLength={250}
                ></textarea>
                <button type="submit" className=" mt-10">
                  <SendQerryButton />
                </button>
              </form>
            </div>
          </div>
          <BackgroundBeams />
        </div>
      </section>
      <MainFooter />
    </div>
  );
};

export default Contact;
