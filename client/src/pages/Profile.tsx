import React, { useState } from "react";
import {
  PencilSquareIcon,
  ScaleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

const Profile: React.FC = () => {
  // Sample user data
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    profilePic: "https://www.w3schools.com/w3images/avatar2.png",
    language: "English",
    notifications: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(userData);

  // Handle saving changes
  const handleSave = () => {
    setUserData(editedData); // Save the edited data
    setIsEditing(false); // Close the edit form
  };

  // Handle cancelling changes
  const handleCancel = () => {
    setEditedData(userData); // Reset to original data
    setIsEditing(false);
  };

  // Update user data (for inputs)
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto p-6">
      {/* Profile Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">Profile</h1>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition duration-300"
        >
          <PencilSquareIcon className="w-5 h-5" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Profile Content */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Profile Image */}
        <div className="flex justify-center items-center">
          <div className="relative">
            <img
              src={userData.profilePic}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-4 border-blue-600 shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
            />
            {isEditing && (
              <button
                className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
                onClick={() =>
                  alert("Profile image upload feature coming soon!")
                }
              >
                <PencilSquareIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Profile Information */}
        <div className="col-span-2 bg-white p-8 rounded-xl shadow-xl transition duration-300 hover:shadow-2xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            General Information
          </h2>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="text-sm text-gray-600">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedData.name}
                  onChange={handleChange}
                  className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
              ) : (
                <p className="mt-2 text-lg font-medium text-gray-800">
                  {userData.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-600">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editedData.email}
                  onChange={handleChange}
                  className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
              ) : (
                <p className="mt-2 text-lg font-medium text-gray-800">
                  {userData.email}
                </p>
              )}
            </div>

            {/* Language */}
            <div>
              <label className="text-sm text-gray-600">Language</label>
              {isEditing ? (
                <select
                  name="language"
                  value={editedData.language}
                  onChange={handleChange}
                  className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              ) : (
                <p className="mt-2 text-lg font-medium text-gray-800">
                  {userData.language}
                </p>
              )}
            </div>

            {/* Notifications */}
            <div>
              <label className="text-sm text-gray-600">Notifications</label>
              {isEditing ? (
                <input
                  type="checkbox"
                  name="notifications"
                  checked={editedData.notifications}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      notifications: e.target.checked,
                    })
                  }
                  className="mt-2 rounded-md"
                />
              ) : (
                <p className="mt-2 text-lg font-medium text-gray-800">
                  {userData.notifications ? "Enabled" : "Disabled"}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-6 mt-8">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition duration-300 flex items-center space-x-2"
              >
                <ScaleIcon className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 transition duration-300 flex items-center space-x-2"
              >
                <XMarkIcon className="w-5 h-5" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
