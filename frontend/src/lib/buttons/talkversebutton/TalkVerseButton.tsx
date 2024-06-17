import "@/lib/buttons/talkversebutton/TalkVerseButton.css";
import { cn } from "@/utils/cn";

type TalkVerseButtonProps = {
  className?: string;
};
const TalkVerseButton = (props: TalkVerseButtonProps) => {
  return (
    <div className={cn("talkContainer flex", props.className)}>
      <div className="talkBox">T</div>
      <div className="talkBox">A</div>
      <div className="talkBox">L</div>
      <div className="talkBox">K</div>
      <div className="talkBox">@</div>
    </div>
  );
};

export default TalkVerseButton;
