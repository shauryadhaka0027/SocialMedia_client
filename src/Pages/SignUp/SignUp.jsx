import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import smApi from "../../api/smApi";
import { useNavigate } from "react-router-dom";
import { useZustand } from "../../Zustand/useZustand";
import { notification } from "antd";

const SignUp = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    bio: "",
    password: "",
  });

  const userSignup = useMutation({
    mutationFn: async (data) => {
      const form = new FormData();
      form.append("email", data.email);
      form.append("username", data.username);
      form.append("bio", data.bio);
      form.append("password", data.password);
      if (data.profilePicture) {
        form.append("profilePicture", data.profilePicture);
      }
      return smApi.signup(form);
    },
  });

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const formToSubmit = {
      ...formData,
      profilePicture: profileImage,
    };
  
    try {
      await userSignup.mutateAsync(formToSubmit, {
        onSuccess: (data) => {
         
          
          if (data && data.data && data.token) {
            localStorage.setItem("userData", JSON.stringify({ data: data.data, token: data.token }));
            navigate("/");
            notification.success({
              type: "success",
              message: data.message,
              duration: 2,
            });
          } else {
            console.error("Response structure is not as expected.");
          }
        },
        onError: (err) => {
          console.error("Signup error:", err);
          notification.error({
            type: "error",
            message: err?.response?.data?.message,
            duration: 2,
          });
        }
      });
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };
  const validateForm = () => {
    const newErrors = {};
  
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;
  
    if (!formData.username) {
      newErrors.username = "Username is required";
    }
  
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
  
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must be at least 6 characters long, contain one uppercase letter, one lowercase letter, and one digit.";
    }
  
    if (!formData.bio) {
      newErrors.bio = "Bio is required";
    }
  
    if (!profileImage) {
      newErrors.profileImage = "Profile image is required";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const onChangeValue = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="flex items-center justify-center bg-blue-100 min-h-screen">
      <div className="w-[800px] bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Signup</h1>
        <form className="w-full max-w-[400px] mx-auto" onSubmit={onSubmitForm}>
       
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center border border-gray-300">
              {profileImage ? (
                <img
                  src={URL.createObjectURL(profileImage)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <i className="bx bxs-user text-gray-400 text-5xl"></i>
              )}
            </div>
            <label
              htmlFor="profilePicture"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md cursor-pointer hover:bg-blue-600 transition"
            >
              Upload Profile Picture
            </label>
            <input
              type="file"
              name="profilePicture"
              id="profilePicture"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            {errors.profileImage && (
              <p className="text-red-500 text-sm">{errors.profileImage}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={onChangeValue}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>

          
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Bio</label>
            <textarea
              name="bio"
              placeholder="Tell us something about yourself"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              value={formData.bio}
              onChange={onChangeValue}
              required
            />
            {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={onChangeValue}
              required
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

         
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={onChangeValue}
              required
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <p className="cursor-pointer p-2  hover:text-blue-600 " onClick={()=>navigate("/login")}>
            Existing User ? Log In
          </p>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600 transition"
            disabled={Object.keys(errors).length > 0}
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
