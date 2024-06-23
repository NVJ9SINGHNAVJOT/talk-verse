import Chat from "@/db/mongodb/models/Chat";
import Group from "@/db/mongodb/models/Group";
import { logger } from "@/logger/logger";
import { channels, groupIds, groupOffline } from "@/socket/index";
import Channel from "@/types/channel";

const setupChannels = async () => {
  try {
    logger.info("setting up channels");
    const allChats = await Chat.find().select({ _id: true }).exec();
    const allGroups = await Group.find().select({ _id: true, members: true }).exec();

    if (allChats.length > 0) {
      allChats.forEach((chat) => {
        // Create a new channel instance
        const channel = new Channel();
        // set channel for new chatId
        channels.set(chat._id.toString(), channel);
      });
    }

    if (allGroups.length > 0) {
      allGroups.forEach((group) => {
        const groupId = group._id.toString();

        // Create a new channel instance
        const channel = new Channel();
        // set channel for new groupId
        channels.set(groupId, channel);

        const memeberIds: string[] = [];
        group.members.forEach((member) => {
          memeberIds.push(member._id.toString());
        });

        // set group members id in groupIds map
        groupIds.set(groupId, memeberIds);
        // initially set all group memebers as offline members
        groupOffline.set(groupId, new Set(memeberIds));
      });
    }
    logger.info("channels setup completed");
  } catch (error) {
    logger.error("error while setting up channels", { error: error });
    process.exit();
  }
};

export default setupChannels;
