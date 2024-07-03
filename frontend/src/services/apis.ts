const BASE_URL_SERVER = process.env.REACT_APP_BASE_URL_SERVER as string;

// auth endpoints
export const authEndPoints = {
  SIGNUP: BASE_URL_SERVER + "/auths/signup",
  OTP: BASE_URL_SERVER + "/auths/sendOtp",
  LOGIN: BASE_URL_SERVER + "/auths/login",
  CHECK_USER: BASE_URL_SERVER + "/auths/checkUser",
  LOGOUT: BASE_URL_SERVER + "/auths/logout",
  CHANGE_PASSWORD: BASE_URL_SERVER + "/auths/changePassword",
  VERIFY_OTP: BASE_URL_SERVER + "/auths/verifyOtp",
  RESET_PASSWORD: BASE_URL_SERVER + "/auths/resetPassword",
};

// profile endpoints
export const profileEndPoints = {
  CHECK_USERNAME: BASE_URL_SERVER + "/profiles/checkUserName", // parameters: userName
  PROFILE_DETAILS: BASE_URL_SERVER + "/profiles/getDetails",
  SET_PROFILE_IMAGE: BASE_URL_SERVER + "/profiles/updateProfileImage",
  SET_PROFILE_DETAILS: BASE_URL_SERVER + "/profiles/updateProfile",
  USER_BLOG_PROFILE: BASE_URL_SERVER + "/profiles/userBlogProfile",
  USER_POSTS: BASE_URL_SERVER + "/profiles/userPosts",
  USER_FOLLOWING: BASE_URL_SERVER + "/profiles/userFollowing",
  USER_FOLLOWERS: BASE_URL_SERVER + "/profiles/userFollowers",
  REMOVE_FOLLOWER: BASE_URL_SERVER + "/profiles/removeFollower",
  UNFOLLOW_FOLLOWING: BASE_URL_SERVER + "/profiles/unfollowUser",
  POST_SAVES: BASE_URL_SERVER + "/profiles/userSavedPosts",
};

// notification endpoints
export const notificationEndPoints = {
  GET_USERS: BASE_URL_SERVER + "/notifications/getUsers", // parameters: userName
  GET_FOLLOW_USERS: BASE_URL_SERVER + "/notifications/getFollowUsers", // parameters: userName
  SEND_REQUEST: BASE_URL_SERVER + "/notifications/sendRequest",
  ACCEPT_REQUEST: BASE_URL_SERVER + "/notifications/acceptRequest",
  DELETE_REQUESET: BASE_URL_SERVER + "/notifications/deleteRequest",
  GET_ALL_NOTIFICATIONS: BASE_URL_SERVER + "/notifications/getAllNotifications",
  CREATE_GROUP: BASE_URL_SERVER + "/notifications/createGroup",
  CHECK_ONLINE_FRIENDS: BASE_URL_SERVER + "/notifications/checkOnlineFriends",
  SET_UNSEEN_COUNT: BASE_URL_SERVER + "/notifications/setUnseenCount",
  SET_ORDER: BASE_URL_SERVER + "/notifications/setOrder",
  SEND_FOLLOW_REQUEST: BASE_URL_SERVER + "/notifications/sendFollowRequest",
  DELETE_FOLLOW_REQUEST: BASE_URL_SERVER + "/notifications/deleteFollowRequest",
  ACCEPT_FOLLOW_REQUEST: BASE_URL_SERVER + "/notifications/acceptFollowRequest",
  FOLLOW_REQUESTS: BASE_URL_SERVER + "/notifications/followRequests",
  FOLLOW_SUGGESTIONS: BASE_URL_SERVER + "/notifications/followSuggestions",
  NEW_FOLLOW_SUGGESTION: BASE_URL_SERVER + "/notifications/newFollowSuggestion",
};

// chat endpoints
export const chatEndPoints = {
  CHAT_BAR_DATA: BASE_URL_SERVER + "/chats/chatBarData",
  CHAT_MESSAGES: BASE_URL_SERVER + "/chats/chatMessages", // parameters: chatId, createdAt
  GROUP_MESSAGES: BASE_URL_SERVER + "/chats/groupMessages", // parameters: groupId, createdAt
  FILE_MESSAGE: BASE_URL_SERVER + "/chats/fileMessage",
};

// post endpoints
export const postEndPoints = {
  CREATE_POST: BASE_URL_SERVER + "/posts/createPost",
  DELETE_POST: BASE_URL_SERVER + "/posts/deletePost", // parameters: postId
  SAVE_POST: BASE_URL_SERVER + "/posts/savePost",
  CREATE_STORY: BASE_URL_SERVER + "/posts/createStory",
  DELETE_STORY: BASE_URL_SERVER + "/posts/deleteStory", // parameters: storyId
  USER_STORY: BASE_URL_SERVER + "/posts/userStory",
  UPDATE_LIKE: BASE_URL_SERVER + "/posts/updateLike", // parameters: postId, update
  ADD_COMMENT: BASE_URL_SERVER + "/posts/addComment",
  DELETE_COMMENT: BASE_URL_SERVER + "/posts/deleteComment",
  POST_COMMENTS: BASE_URL_SERVER + "/posts/postComments", // parameters: postId, createdAt
  GET_STORIES: BASE_URL_SERVER + "/posts/getStories", // parameters: createdAt
  RECENT_POSTS: BASE_URL_SERVER + "/posts/recentPosts", // parameters: createdAt
  TRENDING_POSTS: BASE_URL_SERVER + "/posts/trendingPosts", // parameters: createdAt
  CATEGORY_POSTS: BASE_URL_SERVER + "/posts/categoryPosts", // parameters: category, createdAt
};

export const queryEndPoints = {
  SEND_QUERY: BASE_URL_SERVER + "/queries/sendQuery",
};

export const reviewEndPoints = {
  POST_REVIEW: BASE_URL_SERVER + "/reviews/postReview",
  GET_REVIEWS: BASE_URL_SERVER + "/reviews/getReviews",
};
