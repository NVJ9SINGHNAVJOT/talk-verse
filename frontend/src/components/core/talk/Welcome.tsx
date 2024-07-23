import welcomeQuotes from "@/data/welcome-quotes";
import { useState, useEffect } from "react";

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const Welcome = () => {
  const [randomNumber, setRandomNumber] = useState<number>(1);

  useEffect(() => {
    const newRandomNumber = getRandomNumber(0, 48);
    setRandomNumber(newRandomNumber);
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center">
        <div
          className="ct-background-shine bg-[linear-gradient(110deg,#939393,45%,#1e293b,55%,#939393)] 
          bg-clip-text text-center text-xl text-transparent"
        >
          "{welcomeQuotes[randomNumber].title}"
        </div>
        <span className="pt-8 text-white">- {welcomeQuotes[randomNumber].author}</span>
      </div>
    </div>
  );
};

export default Welcome;
