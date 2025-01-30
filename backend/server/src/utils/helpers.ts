import { getErrorDetails } from "@/logger/error";
import { logger } from "@/logger/logger";
import { isValidMongooseObjectId } from "@/validators/mongooseId";

export const checkTags = (tags: string): string[] => {
  let checkTags: string[] = []; // Initialize as an empty array

  try {
    checkTags = JSON.parse(tags);
  } catch (error) {
    // If JSON.parse fails, return an empty array
    logger.error("error while parsing tags", { tags: tags, error: getErrorDetails(error) });
    return [];
  }

  // Check if checkTags is an array and not empty
  if (!Array.isArray(checkTags) || checkTags.length === 0) {
    return [];
  }

  // Check each tag's length
  for (let index = 0; index < checkTags.length; index++) {
    const element = checkTags[index];
    if (!element || !element.trim() || element.length > 255) {
      return [];
    }
    checkTags[index] = element.trim();
  }

  return checkTags;
};

export const checkContent = (content: string): string[] => {
  let checkContent: string[] = []; // Initialize as an empty array

  try {
    checkContent = JSON.parse(content);
  } catch (error) {
    // If JSON.parse fails, return an empty array
    logger.error("error while parsing content", { content: content, error: getErrorDetails(error) });
    return [];
  }

  // Check if checkContent is an array and not empty
  if (!Array.isArray(checkContent) || checkContent.length === 0) {
    return [];
  }

  // check if content have valid string order
  if (!checkContent[0]?.trim() || !checkContent[checkContent.length - 1]?.trim()) {
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
  } catch (error) {
    // If JSON.parse fails, return an empty array
    logger.error("error while parsing content", {
      groupMembers: groupMembers,
      error: getErrorDetails(error),
    });
    return [];
  }

  // Check if checkMembers is an array and not empty
  if (
    !Array.isArray(checkMembers) ||
    checkMembers.length < 2 ||
    checkMembers.length > 49 ||
    !isValidMongooseObjectId(checkMembers, "yes")
  ) {
    return [];
  }

  return checkMembers;
};
