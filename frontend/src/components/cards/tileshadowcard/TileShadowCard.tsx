import "@/components/cards/tileshadowcard/TileShadowCard.css"
import { FcConferenceCall } from "react-icons/fc";

const TileShadowCard = () => {
    return (
        <div className="shadowbox w-5/12 h-[25rem] text-white text-2xl flex flex-col justify-center items-center">
            <p className=" text-center p-4 text-2xl font-bold tracking-tight text-gray-900">
                <span><FcConferenceCall className=" inline-block aspect-square w-10"/></span>TalkVerse : Connecting Conversations
            </p>
            <br />
            <p className=" text-center p-4 text-lg">
                Discover a world of real-time communication with TalkVerse!
                Whether you're catching up with friends, sharing your thoughts,
                or meeting new people, our platform makes it seamless.
                Crafted with simplicity in mind, TalkVerse lets you chat privately
            </p>
        </div>
    )
}

export default TileShadowCard