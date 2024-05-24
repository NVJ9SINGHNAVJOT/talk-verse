import LettersPull from "@/lib/cards/LettersPull";
import {
  TextRevealCard,
  TextRevealCardDescription,
  TextRevealCardTitle,
} from "@/lib/cards/TextRevealCard";

const Contact = () => {
  return (
    <div className="w-full pt-10 bg-[#0E0E10] ">
      <LettersPull className="text-white" words={"Contact Us"} delay={0.05} />
      <section className=" w-full flex items-center justify-center h-[28rem]">
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
      </section>
      <section className=" w-full h-96 bg-teal-950"></section>
    </div>
  );
};

export default Contact;
