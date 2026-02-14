import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiHome,
  FiBox,
  FiSettings,
  FiMail,
  FiHelpCircle,
  FiChevronDown,
} from "react-icons/fi";

import logoImg from "../../../assets/logo.png";

const Sidebar = ({ collapsed }) => {
  const [openMenu, setOpenMenu] = useState(true);
  const [openService, setOpenService] = useState(false); 

  return (
    <div className="min-h-screen p-4">
      <div className="mb-10 flex justify-center">
        {collapsed ? (
          <img src={logoImg} alt="logo" className="w-10" />
        ) : (
          <img src={logoImg} alt="logo" className="w-40" />
        )}
      </div>

      <ul className="space-y-6 text-sm font-semibold text-gray-500 p-3">
        <li>
          <Link to="/" className="flex items-center gap-3 hover:text-red-500">
            <FiHome size={20} />
            {!collapsed && <span>Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link
            to="/package"
            className="flex items-center gap-3 hover:text-red-500"
          >
            <FiBox size={20} />
            {!collapsed && <span>Package</span>}
          </Link>
        </li>
        <li>
          <div
            onClick={() => setOpenService(!openService)}
            className="flex items-center justify-between cursor-pointer hover:text-red-500"
          >
            <div className="flex items-center gap-3">
              <FiSettings size={20} />
              {!collapsed && <span>Service</span>}
            </div>

            {!collapsed && (
              <FiChevronDown
                className={`transition-transform duration-300 ${
                  openService ? "rotate-180" : ""
                }`}
              />
            )}
          </div>
          {!collapsed && openService && (
            <ul className="pl-8 mt-3 space-y-3 text-gray-400">
              <li>
                <Link to="/service/hotel" className="hover:text-red-500">
                  Hotel
                </Link>
              </li>
              <li>
                <Link to="/service/flight" className="hover:text-red-500">
                  Flight
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link
            to="/contact"
            className="flex items-center gap-3 hover:text-red-500"
          >
            <FiMail size={20} />
            {!collapsed && <span>Contact Us</span>}
          </Link>
        </li>
        <li>
          <Link
            to="/enquiry"
            className="flex items-center gap-3 hover:text-red-500"
          >
            <FiHelpCircle size={20} />
            {!collapsed && <span>Enquiry</span>}
          </Link>
        </li>
        <li>
          <div
            onClick={() => setOpenMenu(!openMenu)}
            className="flex items-center justify-between cursor-pointer hover:text-red-500"
          >
            {!collapsed && <span>Menu</span>}
            {!collapsed && (
              <FiChevronDown
                className={`transition-transform ${
                  openMenu ? "rotate-180" : ""
                }`}
              />
            )}
          </div>

          {!collapsed && openMenu && (
            <ul className="pl-6 mt-3 space-y-3">
              <li>
                <Link to="/menus" className="hover:text-red-500">
                  Menus
                </Link>
              </li>
              <li>
                <Link to="/submenu" className="hover:text-red-500">
                  Submenu
                </Link>
              </li>
              <li>
                <Link to="/zone" className="hover:text-red-500">
                  Zone
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
