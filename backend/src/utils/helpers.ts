import { logger } from "@/logger/logger";
import { isValidMongooseObjectId } from "@/validators/mongooseId";

export const checkTags = (tags: string): string[] => {
  let checkTags: string[] = []; // Initialize as an empty array

  try {
    checkTags = JSON.parse(tags);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // If JSON.parse fails, return an empty array
    logger.error("error while parsing tags", { tags: tags });
    return [];
  }

  // Check if checkTags is an array and not empty
  if (!Array.isArray(checkTags) || checkTags.length === 0 || checkTags.includes("")) {
    return [];
  }

  // Check each tag's length
  const hasInvalidTag = checkTags.some((tag) => tag.length > 255);

  if (hasInvalidTag) {
    return [];
  }

  return checkTags;
};

export const checkContent = (content: string): string[] => {
  let checkContent: string[] = []; // Initialize as an empty array

  try {
    checkContent = JSON.parse(content);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // If JSON.parse fails, return an empty array
    logger.error("error while parsing content", { content: content });
    return [];
  }

  // Check if checkContent is an array and not empty
  if (!Array.isArray(checkContent) || checkContent.length === 0) {
    return [];
  }

  // check if content have valid string order
  if (checkContent[0] === "" || checkContent[checkContent.length - 1] === "") {
    return [];
  }

  // check total content lenght
  const combinedLength = checkContent.reduce((total, str) => total + str.length, 0);
  if (combinedLength > 1000) {
    return [];
  }

  return checkContent;
};

export const checkGroupMembers = (groupMembers: string): string[] => {
  let checkMembers: string[] = []; // Initialize as an empty array

  try {
    checkMembers = JSON.parse(groupMembers);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // If JSON.parse fails, return an empty array
    logger.error("error while parsing content", { groupMembers: groupMembers });
    return [];
  }

  // Check if checkMembers is an array and not empty
  if (
    !Array.isArray(checkMembers) ||
    checkMembers.length < 2 ||
    checkMembers.length > 49 ||
    !isValidMongooseObjectId(checkMembers)
  ) {
    return [];
  }

  return checkMembers;
};
