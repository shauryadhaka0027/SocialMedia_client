
export const ApiUrl={
    auth:{
        signupUser:"/user/signup",
        userLogin:"/user/login",
    },
    user:{
        getUserProfile:"/user/image",
        getUserDetails:"/user/getUsers",
        addFollowing:"/user/addFollowing",
        getUserById:"/user/getUserById",
        userUnfollow:"/user/userUnfollow",
        userProfileUpdate:"/user/updateUser",
        userPasswordChange:"/user/updatePassword"
    },
    post:{
        postUser:"/user/postData",
        getUserPost:"/user/getAllPost",
        getLikesPost:"/user/getLikesPost",
        getCommentsPost:"/user/getCommentsPost",
        deleteUserPost:"/user/deleteUserPost",
        getUserPostById:"/user/getPostById",
        updateUserPost:"/user/updateUserPost"
    },
    notification:{
        getUserNotification:"/user/getNotifications",
        acceptRequest:"/user/acceptRequest"
      
    },
    logout:{
        logoutUser:"/user/logout"
    },
    search:{
        searchUser:"/user/search"
    }
}