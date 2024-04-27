import "@/lib/cards/chatwelcomecard/ChatWelcomeCard.css";
import welcomeQuotes from "@/assets/data/welcome-quotes";
import { useEffect, useState } from "react";

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const ChatWelcomeCard = () => {
  const [randomNumber, setRandomNumber] = useState<number>(1);
  useEffect(() => {
    const newRandomNumber = getRandomNumber(0, 48);
    setRandomNumber(newRandomNumber);
  }, []);

  return (
    <div className=" flex flex-col items-center">
      <div
        className=" text-center quote bg-[linear-gradient(110deg,#939393,45%,#1e293b,55%,#939393)] 
                bg-[length:250%_100%] bg-clip-text text-xl text-transparent"
      >
        "{welcomeQuotes[randomNumber].title}"
      </div>
      <span className=" text-white pt-8">
        - {welcomeQuotes[randomNumber].author}
      </span>
    </div>
  );
};

export default ChatWelcomeCard;
