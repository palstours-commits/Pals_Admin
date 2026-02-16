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

const SidebarItem = ({ to, icon: Icon, label, collapsed }) => {
  return (
    <li className="relative group">
      <Link
        to={to}
        className={`flex items-center p-2 rounded-md hover:text-red-500
          ${collapsed ? "justify-center" : "gap-3"}
        `}
      >
        <Icon size={20} />
        {!collapsed && <span>{label}</span>}
      </Link>
      {collapsed && (
        <span
          className="absolute left-14 top-1/2 -translate-y-1/2
          bg-black text-white text-xs px-2 py-1 rounded
          opacity-0 group-hover:opacity-100 transition
          whitespace-nowrap z-50"
        >
          {label}
        </span>
      )}
    </li>
  );
};

const Sidebar = ({ collapsed }) => {
  const [openMenu, setOpenMenu] = useState(true);
  const [openService, setOpenService] = useState(false);

  return (
    <div className="min-h-screen p-4">
      <div className="mb-10 flex justify-center">
        <img
          src="./navbar_logo.svg"
          alt="logo"
          className={collapsed ? "w-6" : "w-20"}
        />
      </div>

      <ul className="space-y-4 text-sm font-semibold text-gray-500">
        <SidebarItem
          to="/"
          icon={FiHome}
          label="Dashboard"
          collapsed={collapsed}
        />
        <SidebarItem
          to="/package"
          icon={FiBox}
          label="Package"
          collapsed={collapsed}
        />
        <li className="relative group">
          <div
            onClick={() => setOpenService(!openService)}
            className={`flex items-center p-2 cursor-pointer hover:text-red-500
              ${collapsed ? "justify-center" : "justify-between"}
            `}
          >
            <div className={`flex items-center ${collapsed ? "" : "gap-3"}`}>
              <FiSettings size={20} />
              {!collapsed && <span>Service</span>}
            </div>

            {!collapsed && (
              <FiChevronDown
                className={`transition-transform ${
                  openService ? "rotate-180" : ""
                }`}
              />
            )}
          </div>
          {collapsed && (
            <span
              className="absolute left-14 top-1/2 -translate-y-1/2
              bg-black text-white text-xs px-2 py-1 rounded
              opacity-0 group-hover:opacity-100 transition
              whitespace-nowrap z-50"
            >
              Service
            </span>
          )}
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
        <SidebarItem
          to="/contact"
          icon={FiMail}
          label="Contact Us"
          collapsed={collapsed}
        />
        <SidebarItem
          to="/enquiry"
          icon={FiHelpCircle}
          label="Enquiry"
          collapsed={collapsed}
        />
        <li>
          <div
            onClick={() => setOpenMenu(!openMenu)}
            className="flex items-center justify-between p-2 cursor-pointer hover:text-red-500"
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
            <ul className="pl-6 mt-3 space-y-3 text-gray-400">
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
              <li>
                <Link to="/packages" className="hover:text-red-500">
                  Package
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
