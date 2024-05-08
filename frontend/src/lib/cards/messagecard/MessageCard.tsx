import "@/lib/cards/messagecard/MessageCard.css";

const MessageCard = () => {
  return (
    <div className="message self-end flex flex-col">
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa,
        molestiae.
      </p>
      <p className=" mt-4 self-end">16:50</p>
    </div>
  );
};

export default MessageCard;
