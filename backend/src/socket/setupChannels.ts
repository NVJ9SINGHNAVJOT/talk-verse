import Chat from "@/db/mongodb/models/Chat";
import Group from "@/db/mongodb/models/Group";
import { channels, groupIds, groupOffline } from "@/socket/index";
import Channel from "@/types/channel";

const setupChannels = async () => {
    const allChats = await Chat.find().select({ _id: true }).exec();
    const allGroups = await Group.find().select({ _id: true, members: true }).exec();

    if (allChats.length > 0) {
        allChats.forEach((chat) => {
            // Create a new channel instance
            const channel = new Channel();
            // set channel for new chatid
            channels.set(chat._id.toString(), channel);
        });
    }

    if (allGroups.length > 0) {
        allGroups.forEach((group) => {
            const grpId = group._id.toString();

            // Create a new channel instance
            const channel = new Channel();
            // set channel for new chatid
            channels.set(grpId, channel);

            const memeberIds: string[] = [];
            group.members.forEach((member) => {
                memeberIds.push(member._id.toString());
            });

            groupIds.set(grpId, memeberIds);
            groupOffline.set(grpId, new Set(memeberIds));
        });
    }
};

export default setupChannels;