import axios from "axios";
import { ApiUrl } from "./apiRoutes";

export const apiUrl = import.meta.env.VITE_API;

export const fetchApi = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});




class FetchData {

  async signup(data) {
    try {
      const response = await fetchApi.post(ApiUrl.auth.signupUser, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error during signup:", error);
      throw error;
    }
  }


  async userImage(data) {
    try {
      const response = await fetchApi.post(ApiUrl.user.getUserProfile, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error while uploading user image:", error);
      throw error;
    }
  }


  async userPost(data) {
    try {
      const response = await fetchApi.post(ApiUrl.post.postUser, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error while posting user data:", error);
      throw error;
    }
  }

  async getUserPost(data) {
    try {
      const response = await fetchApi.post(ApiUrl.post.getUserPost, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
    } catch (error) {
      console.error("Error while creating user post:", error);
      throw error;
    }
  }

  async getLikesPost(data) {
    try {
      const response = await fetchApi.post(ApiUrl.post.getLikesPost, data);
      return response.data;
    } catch (error) {
      console.error("Error while getting likes post:", error);
      throw error;
    }
  }

  async getCommentsPost(data) {
    try {
      const response = await fetchApi.post(ApiUrl.post.getCommentsPost, data, data);
      return response.data;
    } catch (error) {
      console.error("Error while getting comments post:", error);
      throw error;
    }
  }

  async getUserDetails(data) {
    try {
      const response = await fetchApi.post(ApiUrl.user.getUserDetails, data, {
        "Content-Type": "application/json",
      });
      return response.data;
    } catch (error) {
      console.error("Error while getting user details:", error);
      throw error;
    }
  }

  async userLogin(data) {
    try {
      const response = await fetchApi.post(ApiUrl.auth.userLogin, data);
      return response.data;
    } catch (error) {
      console.error("Error while logging in:", error);
      throw error;
    }
  }

  async deleteUserPost(data) {
    try {
      const response = await fetchApi.post(ApiUrl.post.deleteUserPost, data);
      return response.data;
    } catch (error) {
      console.error("Error while deleting user post:", error);
      throw error;
    }
  }

  async addFollowing(data) {
    try {
      const response = await fetchApi.post(ApiUrl.user.addFollowing, data);
      return response.data;
    } catch (error) {
      console.error("Error while adding following:", error);
      throw error;
    }
  }

  async getUserDetailsById(data) {
    try {
      const response = await fetchApi.post(ApiUrl.user.getUserById, data); // Pass JSON data
      return response.data;
    } catch (error) {
      console.error("Error while getting user details:", error);
      throw error;
    }
  }

  async userUnfollow(data) {
    try {
      const response = await fetchApi.post(ApiUrl?.user?.userUnfollow, data); // Pass JSON data
      return response.data;
    } catch (error) {
      console.error("Error while unfollowing:", error);
      throw error;
    }
  }

  async updateUserProfile(data) {
    try {
      const response = await fetchApi.patch(ApiUrl.user.userProfileUpdate, data)
      return response.data;
    } catch (error) {
      console.error("Error while updating user profile:", error);
      throw error;
    }
  }

  async updateUserPassword(data) {
    try {
      const response = await fetchApi.patch(ApiUrl.user.userPasswordChange, data);
      return response.data;
    } catch (error) {
      console.error("Error while updating user password:", error);
      throw error;
    }
  }

  async getNotifications(data) {
    try {
      const response = await fetchApi.post(ApiUrl.notification.getUserNotification, data);
      return response.data;
    } catch (error) {
      console.error("Error while getting notifications:", error);
      throw error;
    }
  }

  async getUserPostById(data) {

    try {
      const response = await fetchApi.post(ApiUrl.post.getUserPostById, data);
      return response.data;
    } catch (error) {
      console.error("Error while getting user post by id:", error);
      throw error;
    }
  }

  async updateUserPost(data) {
    try {
      const response = await fetchApi.patch(ApiUrl.post.updateUserPost, data);
      return response.data;
    } catch (error) {
      console.error("Error while updating user post:", error);
      throw error;
    }
  }
  async userLogout(data){
    try {
      const response = await fetchApi.post(ApiUrl.logout.logoutUser, data);
      return response.data;
    } catch (error) {
      console.error("Error while logging out:", error);
      throw error;
    }
  }
}

export default new FetchData();
