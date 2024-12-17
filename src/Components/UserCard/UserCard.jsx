import React, { useEffect, useState } from "react";
import { useZustand } from "../../Zustand/useZustand";
import { UserForm } from "../PopUserForm/UserForm";
import { useMutation } from "@tanstack/react-query";
import smApi from "../../api/smApi";
import { ProfileImageChange } from "../ProfileChangeImage/ProfileImageChange";
import ChangePassword from "../ChangePassword/ChangePassword";
import { Button, notification } from "antd";
import { useNavigate } from "react-router-dom";

const UserCard = () => {
  const { userInformation, setUserInformation,isHidden } = useZustand()
  const [isopen, setIsOpen] = useState(false)
  const [isclosed, setIsClosed] = useState(false)
  const navigate=useNavigate()
  const [isChangePassword, setIsChangePassword] = useState(false)
  const getUserDetailsById = useMutation({
    mutationFn: smApi.getUserDetailsById
  })

  const userProfileUpdate = useMutation({
    mutationFn: smApi.updateUserProfile
  })

  const userLogout = useMutation({
    mutationFn: smApi.userLogout
  })
  useEffect(() => {
    getUserData()
  }, [])

  // console.log("user",userInformation)

  const getUserData = () => {
    const storeData = localStorage.getItem("userData")
    if (storeData) {
      const userData = JSON.parse(storeData)
      getUserDetailsById.mutate({ _id: userData.data?._id }, {
        onSuccess: (data) => {
          setUserInformation(data?.data)

        },
        onError: (error) => {
          if (error?.response?.data.msg === "Token is not provided") {
            localStorage.removeItem('userData')
          
            window.location.href = "/login"
          }
          console.error("Error fetching user details:", error);
        }
      })

    }
  }


  const toggleForm = (data) => {

    setIsOpen(data)
  }
  const onSubmitFormData = (formData) => {
    console.log('onSubmitFormData', formData)
    userProfileUpdate.mutate({ ...formData, _id: userInformation?._id }, {
      onSuccess: (data) => {
        alert("Form submitted successfully!");
        getUserData()
        setIsOpen(false)
      }
    })
  }
  const profilePictureUpdate = (data) => {
    if (data === 'done') {
      getUserData()
      setIsClosed(!isclosed)
    }

  }

  const passwordChange = (data) => {
    setIsChangePassword(data)
  }

  const logout = () => {
    userLogout.mutate({}, {
      onSuccess: (data) => {

       navigate("/login")
        localStorage.removeItem('userData')

        notification.success({
          type: "success",
          message: data?.Message,
        })
      }
    })

  }
  return (
    // <div className="w-[20%] hidden md:block   bg-white shadow-lg rounded-lg p-6 sm:block ">
    <div className={`w-full lg:w-[20%] bg-white shadow-lg rounded-lg p-6 block md:w-[20%] sm:w-[60%]  ${
          isHidden ? "hidden" : "block" 
        } lg:block`}>


      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 cursor-pointer" onClick={() => setIsClosed(!isclosed)}>
          <img
            src={userInformation?.profilePicture}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        {isclosed && <ProfileImageChange data={isclosed} id={userInformation?._id} profileUpdate={profilePictureUpdate} />}
        <h2 className="mt-4 text-lg font-semibold text-gray-800">{userInformation?.username}</h2>
        <p className="text-gray-500 text-sm text-center">{userInformation?.bio}</p>
        <p className="text-gray-400 text-lg  py-2 ">Followers  {userInformation?.followers?.length}</p>
        <p className="text-gray-400 text-lg">Following  {userInformation?.following?.length}</p>



      </div>
      <hr className="my-4" />

      <ul className="space-y-4">
        <li className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-blue-500"  >
          <i className="bx bx-user text-lg"></i>
          <span onClick={() => setIsOpen(!isopen)}>Profile</span>
          {isopen && <> <UserForm data={isopen} userData={userInformation} toggleForm={toggleForm} onSubmitFormData={onSubmitFormData} /></>}

        </li>
        <li className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-blue-500">
          <i className="bx bx-briefcase text-lg"></i>
          <span onClick={() => setIsChangePassword(!isChangePassword)}>Password</span>
          {isChangePassword && <><ChangePassword passwordChange={passwordChange} data={isChangePassword} /></>}
        </li>
        <li className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-blue-500">
          <i className="bx bx-cog text-lg"></i>
          <Button className="border-2 text-red-600 border-red-600" onClick={logout}>Logout</Button>
        </li>
      </ul>
    </div>

  )

}
export default UserCard