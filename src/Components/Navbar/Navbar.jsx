import React, { useEffect, useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { AiOutlineMenu } from "react-icons/ai";
import { useZustand } from "../../Zustand/useZustand";
import Notification from "../Notification/Notification";
import { useMutation } from "@tanstack/react-query";
import smApi from "../../api/smApi";

export const Navbar = () => {
  const { userInformation, setNotification } = useZustand();
  const [debouncedValue, setDebouncedValue] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); 

  const { setISHidden, isHidden } = useZustand();
  const menuRef = useRef(null);

  const userSearch = useMutation({
    mutationFn: smApi.searchUser,
  });

  const onChangeSearch = (e) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (debouncedValue) {
      userSearch.mutate(
        { value: debouncedValue },
        {
          onSuccess: (data) => {
            setSearchResults(data?.data || []);
          },
          onError: () => {
            setSearchResults([]);
          },
        }
      );
    } else {
      setSearchResults([]);
    }
  }, [debouncedValue]);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setISHidden(!isHidden);
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
  };

  return (
    <nav className="w-[98%] m-auto bg-white text-black p-4 shadow-lg relative">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
        <h1 className="text-lg font-bold">Social Media App</h1>

        <div className="hidden md:flex w-[50%] h-auto relative mt-4 md:mt-0" ref={menuRef}>
          <input
            type="text"
            placeholder="Search..."
            value={searchInput}
            onChange={onChangeSearch}
            className="w-full sm:w-4/5 h-9 rounded-full text-black px-11 border-2 focus:outline-blue-400"
          />
          <button className="text-black h-9 rounded-full absolute left-4 top-1/2 -translate-y-1/2">
            <IoIosSearch size={20} />
          </button>

          {searchResults.length > 0 && (
            <ul className="absolute top-10 left-0 w-[80%] bg-white border rounded-lg shadow-md z-50">
              {searchResults.map((user) => (
                <li
                  key={user._id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={user.profilePicture || "/default-profile.png"}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span>{user.username}</span>
                  </div>

                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => handleViewProfile(user)} 
                  >
                    View Profile
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center gap-5">
          <Notification readNotification={() => {}} />

          <div className="hidden md:flex items-center">
            <img
              src={userInformation?.profilePicture || "/default-profile.png"}
              alt={`${userInformation?.username || "User"}'s Image`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="ml-4 text-sm font-medium">
              {userInformation?.username || "Guest"}
            </span>
          </div>

          <button className="md:hidden text-black" onClick={toggleMenu}>
            <AiOutlineMenu size={24} />
          </button>
        </div>
      </div>

      
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px]">
            <h2 className="text-xl font-bold mb-4">User Profile</h2>
            <div className="flex flex-col gap-3">
              <img
                src={selectedUser.profilePicture || "/default-profile.png"}
                alt={selectedUser.username}
                className="w-20 h-20 rounded-full object-cover mx-auto"
              />
              <p>
                <strong>Username:</strong> {selectedUser.username}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email || "N/A"}
              </p>
              <p>
                <strong>Bio:</strong> {selectedUser.bio || "No bio available"}
              </p>
            </div>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
              onClick={() => setSelectedUser(null)} 
            >
              Close
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
