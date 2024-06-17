import { logger } from "@/logger/logger";

export const checkTags = (tags: string): string[] => {
  let checkTags: string[] = []; // Initialize as an empty array

  try {
    checkTags = JSON.parse(tags);
  } catch (error) {
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
    checkContent = JSON.parse(content); // Initialize as an empty array
  } catch (error) {
    // If JSON.parse fails, return an empty array
    logger.error("error while parsing content", { content: content });
    return [];
  }

  // Check if checkTags is an array and not empty
  if (!Array.isArray(checkContent) || checkContent.length === 0) {
    return [];
  }

  if (checkContent[0] === "" || checkContent[checkContent.length - 1] === "") {
    return [];
  }

  const combinedLength = checkContent.reduce((total, str) => total + str.length, 0);
  if (combinedLength > 1000) {
    return [];
  }

  return checkContent;
};
