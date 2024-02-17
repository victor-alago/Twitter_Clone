import React from 'react';
import { NavLink } from 'react-router-dom'; // Assuming you're using react-router-dom for navigation

const MainSettingMenu = () => {

  return (
    <div className="settings-menu bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="settings-menu-header">
        <h2 className="settings-menu-title font-bold text-4xl mb-10 mt-5">Settings</h2>
        </div>
      {/* Settings options list */}
      <ul className="settings-options">
        <li className="setting-item py-3 px-4 border-b-4 border-gray-200 hover:bg-gray-100">
          {/* Link to the Your Account page */}
          <NavLink to="/setting/account" className="flex justify-between items-center text-gray-700 hover:text-gray-900">
            <span>Your account</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default MainSettingMenu;
