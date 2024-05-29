const BASE_URL_SERVER = process.env.REACT_APP_BASE_URL_SERVER as string;

// auth endpoints
export const authEndPoints = {
  SIGNUP: BASE_URL_SERVER + "/auth/signup",
  OTP: BASE_URL_SERVER + "/auth/sendOtp",
  LOGIN: BASE_URL_SERVER + "/auth/login",
  CHECK_USER: BASE_URL_SERVER + "/auth/checkUser",
  LOGOUT: BASE_URL_SERVER + "/auth/logout"
};

// profile endpoints
export const profileEndPoints = {
  CHECK_USERNAME: BASE_URL_SERVER + "/profile/checkUserName", // parameters: userName
  PROFILE_DETAILS: BASE_URL_SERVER + "/profile/getDetails",
  SET_PROFILE_IMAGE: BASE_URL_SERVER + "/profile/updateProfileImage",
  SET_PROFILE_DETAILS: BASE_URL_SERVER + "/profile/updateUserDetails"
};

// notification endpoints
export const notificationEndPoints = {
  GET_USERS: BASE_URL_SERVER + "/notification/getUsers", // parameters: userName
  SEND_REQUEST: BASE_URL_SERVER + "/notification/sendRequest",
  ACCEPT_REQUEST: BASE_URL_SERVER + "/notification/acceptRequest",
  DELETE_REQUESET: BASE_URL_SERVER + "/notification/deleteRequest",
  GET_ALL_NOTIFICATIONS: BASE_URL_SERVER + "/notification/getAllNotifications",
  CREATE_GROUP: BASE_URL_SERVER + "/notification/createGroup",
  CHECK_ONLINE_FRIENDS: BASE_URL_SERVER + "/notification/checkOnlineFriends",
  SET_UNSEEN_COUNT: BASE_URL_SERVER + "/notification/setUnseenCount",
  SET_ORDER: BASE_URL_SERVER + "/notification/setOrder"
};

// chat endpoints
export const chatEndPoints = {
  CHAT_BAR_DATA: BASE_URL_SERVER + "/chat/chatBarData",
  CHAT_MESSAGES: BASE_URL_SERVER + "/chat/chatMessages", // parameters: chatId, createdAt
  GROUP_MESSAGES: BASE_URL_SERVER + "/chat/groupMessages", // parameters: groupId, createdAt
  FILE_MESSAGE: BASE_URL_SERVER + "/chat/fileMessage",
};

// userPost endpoints
export const postEndPoints = {
  USER_BLOG_PROFILE: BASE_URL_SERVER + "/post/userBlogProfile",
  CREATE_POST: BASE_URL_SERVER + "/post/createPost",
  DELETE_POST: BASE_URL_SERVER + "/post/deletePost", // parameters: postId
  CREATE_STORY: BASE_URL_SERVER + "/post/createStory",
  DELETE_STORY: BASE_URL_SERVER + "/post/deleteStory", // parameters: storyId
  UPDATE_LIKE: BASE_URL_SERVER + "/post/updateLike", // parameters: postId, update
  GET_STORIES: BASE_URL_SERVER + "/post/getStories",
  ADD_COMMENT: BASE_URL_SERVER + "/post/addComment",
  DELETE_COMMENT: BASE_URL_SERVER + "/post/deleteComment",
  RECENT_POSTS: BASE_URL_SERVER + "/post/recentPosts",
  TRENDING_POSTS_: BASE_URL_SERVER + "/post/trendingPosts",
  CATEGORY_POSTS: BASE_URL_SERVER + "/post/categoryPosts", // parameters: category
};