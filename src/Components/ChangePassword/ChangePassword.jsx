import { useMutation } from "@tanstack/react-query";
import { Modal } from "antd";
import React, { useState } from "react";
import smApi from "../../api/smApi";
import { useZustand } from "../../Zustand/useZustand";

const ChangePassword = ({ data, passwordChange }) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { userInformation } = useZustand()
    const [isModalVisible, setIsModalVisible] = useState(data);
    const [error, setError] = useState("");

    const userUpdatePassword = useMutation({
        mutationFn: smApi.updateUserPassword
    })

    const handleSubmit = (e) => {
        e.preventDefault();

        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;

        if (!passwordRegex.test(newPassword)) {
            setError("Password must be at least 6 characters long, contain one uppercase letter, one lowercase letter, and one digit.")
            return;
        }
        if (confirmPassword.length === 0) {
            setError("Confirm password field is required.")
            return;
        }

        if (newPassword === confirmPassword) {
            userUpdatePassword.mutate({ _id: userInformation, password: confirmPassword }, {
                onSuccess: (data) => {
                    setIsModalVisible(false);
                    alert("Password changed successfully!");
                }
            })


        } else {
            alert("Passwords do not match!");
        }
    };

    const handleCloseModal = () => {
        passwordChange(false)
    };
    return (
        <Modal
            open={isModalVisible}
            onCancel={handleCloseModal}
            footer={null}
        >
            <div className="flex items-center justify-center my-8 bg-gray-100">
                <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-smx m-4">
                    <h2 className="text-2xl font-bold mb-4 text-center">Change your password</h2>
                    <p className="text-gray-600 text-sm mb-6 text-center">
                        Enter a new password below to change your password
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label
                                htmlFor="newPassword"
                                className="block text-gray-700 font-medium mb-1"
                            >
                                New password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="New password"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                            />
                        </div>
                        {error && <p className="text-red-500 text-xs">{error}</p>}
                        <div className="mb-6">
                            <label
                                htmlFor="confirmPassword"
                                className="block text-gray-700 font-medium mb-1"
                            >
                                Confirm password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm password"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md transition duration-200"
                        >
                            CHANGE PASSWORD
                        </button>
                    </form>
                </div>
            </div>
        </Modal>

    );
};

export default ChangePassword;
