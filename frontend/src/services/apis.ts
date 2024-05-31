const BASE_URL_SERVER = process.env.REACT_APP_BASE_URL_SERVER as string;

// auth endpoints
export const authEndPoints = {
  SIGNUP: BASE_URL_SERVER + "/auths/signup",
  OTP: BASE_URL_SERVER + "/auths/sendOtp",
  LOGIN: BASE_URL_SERVER + "/auths/login",
  CHECK_USER: BASE_URL_SERVER + "/auths/checkUser",
  LOGOUT: BASE_URL_SERVER + "/auths/logout"
};

// profile endpoints
export const profileEndPoints = {
  CHECK_USERNAME: BASE_URL_SERVER + "/profiles/checkUserName", // parameters: userName
  PROFILE_DETAILS: BASE_URL_SERVER + "/profiles/getDetails",
  SET_PROFILE_IMAGE: BASE_URL_SERVER + "/profiles/updateProfileImage",
  SET_PROFILE_DETAILS: BASE_URL_SERVER + "/profiles/updateProfile"
};

// notification endpoints
export const notificationEndPoints = {
  GET_USERS: BASE_URL_SERVER + "/notifications/getUsers", // parameters: userName
  SEND_REQUEST: BASE_URL_SERVER + "/notifications/sendRequest",
  ACCEPT_REQUEST: BASE_URL_SERVER + "/notifications/acceptRequest",
  DELETE_REQUESET: BASE_URL_SERVER + "/notifications/deleteRequest",
  GET_ALL_NOTIFICATIONS: BASE_URL_SERVER + "/notifications/getAllNotifications",
  CREATE_GROUP: BASE_URL_SERVER + "/notifications/createGroup",
  CHECK_ONLINE_FRIENDS: BASE_URL_SERVER + "/notifications/checkOnlineFriends",
  SET_UNSEEN_COUNT: BASE_URL_SERVER + "/notifications/setUnseenCount",
  SET_ORDER: BASE_URL_SERVER + "/notifications/setOrder"
};

// chat endpoints
export const chatEndPoints = {
  CHAT_BAR_DATA: BASE_URL_SERVER + "/chats/chatBarData",
  CHAT_MESSAGES: BASE_URL_SERVER + "/chats/chatMessages", // parameters: chatId, createdAt
  GROUP_MESSAGES: BASE_URL_SERVER + "/chats/groupMessages", // parameters: groupId, createdAt
  FILE_MESSAGE: BASE_URL_SERVER + "/chats/fileMessage",
};

// userPost endpoints
export const postEndPoints = {
  USER_BLOG_PROFILE: BASE_URL_SERVER + "/posts/userBlogProfile",
  CREATE_POST: BASE_URL_SERVER + "/posts/createPost",
  DELETE_POST: BASE_URL_SERVER + "/posts/deletePost", // parameters: postId
  CREATE_STORY: BASE_URL_SERVER + "/posts/createStory",
  DELETE_STORY: BASE_URL_SERVER + "/posts/deleteStory", // parameters: storyId
  UPDATE_LIKE: BASE_URL_SERVER + "/posts/updateLike", // parameters: postId, update
  GET_STORIES: BASE_URL_SERVER + "/posts/getStories",
  ADD_COMMENT: BASE_URL_SERVER + "/posts/addComment",
  DELETE_COMMENT: BASE_URL_SERVER + "/posts/deleteComment", // parameters: commentId
  RECENT_POSTS: BASE_URL_SERVER + "/posts/recentPosts",
  TRENDING_POSTS_: BASE_URL_SERVER + "/posts/trendingPosts",
  CATEGORY_POSTS: BASE_URL_SERVER + "/posts/categoryPosts", // parameters: category
};