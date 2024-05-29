import Chat from "@/db/mongodb/models/Chat";
import Group from "@/db/mongodb/models/Group";
import { channels, groupIds, groupOffline } from "@/socket/index";
import Channel from "@/types/channel";

const setupChannels = async () => {
    const allChats = await Chat.find().select({ id: true }).exec();
    const allGroups = await Group.find().select({ id: true, members: true }).exec();

    if (allChats.length > 0) {
        allChats.forEach((chat) => {
            // Create a new channel instance
            const channel = new Channel();
            // set channel for new chatId
            channels.set(chat.id, channel);
        });
    }

    if (allGroups.length > 0) {
        allGroups.forEach((group) => {
            const groupId = group.id;

            // Create a new channel instance
            const channel = new Channel();
            // set channel for new groupId
            channels.set(groupId, channel);

            const memeberIds: string[] = [];
            group.members.forEach((member) => {
                memeberIds.push(member.id.toString());
            });

            // set group members id in groupIds map
            groupIds.set(groupId, memeberIds);
            // initially set all group memebers as offline members
            groupOffline.set(groupId, new Set(memeberIds));
        });
    }
};

export default setupChannels;