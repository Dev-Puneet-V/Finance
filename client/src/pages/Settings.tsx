import React, { useState } from "react";
import { ScaleIcon, LockClosedIcon, TrashIcon } from "@heroicons/react/24/solid"; // Heroicons for settings

const Settings: React.FC = () => {
  // User settings data (initial values for demo purposes)
  const [settings, setSettings] = useState({
    email: "john.doe@example.com",
    password: "",
    language: "English",
    notifications: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Handle settings changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveChanges = () => {
    // Here, you would save the settings (via API, for example)
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset the settings to initial values when canceling
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    // Account deletion logic goes here
    setShowDeleteModal(false);
    alert("Account deleted successfully!");
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header */}
      <h1 className="text-4xl font-semibold text-gray-900 mb-8">Settings</h1>

      {/* Settings Tabs */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Account Settings
        </h2>

        {/* Settings Form */}
        <div className="space-y-6">
          <div>
            <label className="text-sm text-gray-600">Email Address</label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-2 p-3 w-full border rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={settings.password}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-2 p-3 w-full border rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
              {isEditing && (
                <button
                  type="button"
                  className="absolute top-0 right-0 text-gray-500 mt-3 mr-3"
                  onClick={() => alert("Password visibility toggled")}
                >
                  <LockClosedIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Preferred Language</label>
            <select
              name="language"
              value={settings.language}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-2 p-3 w-full border rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Notifications</label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={settings.notifications}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: e.target.checked,
                    })
                  }
                  disabled={!isEditing}
                  className="form-checkbox h-5 w-5 text-blue-500"
                />
                <span className="ml-2 text-gray-700">Enable Notifications</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-6 mt-8">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveChanges}
                className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition duration-300 flex items-center space-x-2"
              >
                <ScaleIcon className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-400 text-white py-2 px-6 rounded-md hover:bg-gray-500 transition duration-300"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Edit Settings
            </button>
          )}
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Danger Zone
        </h2>
        <div className="space-y-4">
          <p className="text-lg text-gray-700">
            If you wish to delete your account permanently, please click the
            button below.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 transition duration-300 flex items-center space-x-2"
          >
            <TrashIcon className="w-5 h-5" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Are you sure?
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              This action is permanent and cannot be undone. Your account will
              be deleted.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 transition duration-300"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-400 text-white py-2 px-6 rounded-md hover:bg-gray-500 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
