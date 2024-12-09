import React, { useState } from "react";
import { Modal, Upload } from "antd";

export const UserForm = ({ data, toggleForm, userData, onSubmitFormData }) => {
  const [isModalVisible, setIsModalVisible] = useState(data);

  const [formData, setFormData] = useState({
    username: userData?.username || "",
    email: userData?.email || "",
    bio: userData?.bio || "",

  });



  const handleCloseModal = () => {
    toggleForm(false);
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    onSubmitFormData(formData);

  };

  return (
    <Modal
      open={isModalVisible}
      onCancel={handleCloseModal}
      footer={null}
    >
      <div className="flex items-center justify-center bg-blue-100  my-6">
        <div className="w-[600px] bg-white shadow-lg rounded-lg ">
          <h1 className="text-3xl font-bold text-center mb-6">Profile Update</h1>
          <form className="w-full max-w-[400px] mx-auto" onSubmit={onSubmitForm}>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>


            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Bio</label>
              <textarea
                name="bio"
                placeholder="Tell us something about yourself"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                value={formData.bio}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 mb-4 text-white py-3 rounded-md shadow-md hover:bg-blue-600 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
};
