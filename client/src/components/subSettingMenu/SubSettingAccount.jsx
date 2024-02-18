import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { updateEmail } from '../../redux/userSlice';
import { logout } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";

const SubSettingAccount = () => {
    const [emailInputs, setEmailInputs] = useState({
      currentEmail: '',
      newEmail: ''
    });
    const [passwordInputs, setPasswordInputs] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [showEmailChange, setShowEmailChange] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user.currentUser);
  
    const handleEmailInputChange = (e) => {
      setEmailInputs({
        ...emailInputs,
        [e.target.name]: e.target.value
      });
    };
  
    const handleSaveNewEmail = async () => {
        if (emailInputs.currentEmail !== currentUser.email) {
          alert('Current email is incorrect.');
          return;
        }
      
        if (emailInputs.newEmail) {
          try {
            const response = await axios.put(
              `/users/${currentUser.username}`,
              { email: emailInputs.newEmail },
              { withCredentials: true }
            );
            
            // Dispatch action to update email in Redux store
            dispatch(updateEmail({ email: emailInputs.newEmail }));
            setShowEmailChange(false); // Hide form after successful update
            
            alert('Email updated successfully');
          } catch (error) {
            console.error('Failed to update email', error.response || error);
            alert('Failed to update email');
          }
        } else {
          alert('Please enter a new email.');
        }
      };
  
      const handlePasswordInputChange = (e) => {
        setPasswordInputs({
          ...passwordInputs,
          [e.target.name]: e.target.value
        });
      };
  
      const handleSaveNewPassword = async () => {
        // Validate new passwords match
        if (passwordInputs.newPassword !== passwordInputs.confirmPassword) {
          alert('New passwords do not match.');
          return;
        }
  
        // Validate current password is not empty
        if (!passwordInputs.currentPassword) {
          alert('Please enter your current password.');
          return;
        }
  
        try {
          // Make an API call to the backend to update the password
          const response = await axios.put(
            `/users/${currentUser.username}/password`, // Update the endpoint as necessary
            {
              currentPassword: passwordInputs.currentPassword,
              newPassword: passwordInputs.newPassword,
            },
            { withCredentials: true }
          );
  
          // If using Redux to manage state, you can dispatch an action here
          // dispatch(updatePassword(response.data));
  
          setShowPasswordChange(false); // Hide form after successful update
          alert('Password updated successfully.');
        } catch (error) {
          console.error('Failed to update password', error.response || error);
          alert('Failed to update password.');
        }
      };

      const handleDeleteUser = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            try {
                const deleteUserResponse = await axios.delete(`/users/${currentUser.username}`);
                console.log(deleteUserResponse);
                dispatch(logout()); // Assuming logout action correctly resets the user state
                navigate("/login");
            } catch (error) {
                console.error("Failed to delete account", error);
                alert("Failed to delete the account. Please try again.");
            }
        }
    };
      

  return (
    <div className="settings-menu bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="settings-menu-header">
        <h2 className="settings-menu-title font-bold text-4xl mt-5 mb-10">Your Account</h2>
      </div>
      <ul className="settings-options">
        <li className="setting-item py-3 px-4 border-b-4 border-gray-200 hover:bg-gray-100">
          <div
            className="flex justify-between items-center text-gray-700 hover:text-gray-900 cursor-pointer"
            onClick={() => setShowEmailChange(!showEmailChange)}
          >
            <span>Change Email</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          {showEmailChange && (
            <div className="mt-4">
              <label htmlFor="currentEmail" className="block text-sm font-medium text-gray-700">
                Current Email
              </label>
              <input
                type="email"
                name="currentEmail"
                value={emailInputs.currentEmail}
                onChange={handleEmailInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 border-2 shadow-sm"
              />
              <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mt-4">
                New Email
              </label>
              <input
                type="email"
                name="newEmail"
                value={emailInputs.newEmail}
                onChange={handleEmailInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 border-2 shadow-sm"
              />
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleSaveNewEmail}
              >
                Save
              </button>
            </div>
          )}
        </li>
        <li className="setting-item py-3 px-4 border-b-4 border-gray-200 hover:bg-gray-100">
        <div
            className="flex justify-between items-center text-gray-700 hover:text-gray-900 cursor-pointer"
            onClick={() => setShowPasswordChange(!showPasswordChange)}
        >
            <span>Change Password</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </div>
        {showPasswordChange && (
            <div className="mt-4">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
            </label>
            <input
                type="password"
                name="currentPassword"
                value={passwordInputs.currentPassword}
                onChange={handlePasswordInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 border-2 shadow-sm"
            />
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mt-4">
                New Password
            </label>
            <input
                type="password"
                name="newPassword"
                value={passwordInputs.newPassword}
                onChange={handlePasswordInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 border-2 shadow-sm"
            />
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mt-4">
                Confirm New Password
            </label>
            <input
                type="password"
                name="confirmPassword"
                value={passwordInputs.confirmPassword}
                onChange={handlePasswordInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 border-2 shadow-sm"
            />
            <button
                onClick={handleSaveNewPassword}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Save
            </button>
            </div>
        )}
        </li>
        <li className="setting-item py-3 px-4 border-t border-gray-200 hover:bg-gray-100">
            <div className="flex justify-between items-center text-gray-700 hover:text-gray-900">
                <span>Delete Account</span>
                <button 
                    onClick={handleDeleteUser} 
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                    Delete
                </button>
            </div>
        </li>

      </ul>
    </div>
  );
};

export default SubSettingAccount;
