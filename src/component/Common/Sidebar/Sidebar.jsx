import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FiHome,
  FiBox,
  FiSettings,
  FiMail,
  FiHelpCircle,
  FiChevronDown,
  FiMenu,
  FiGrid,
} from "react-icons/fi";

import { MdDateRange } from "react-icons/md";

const SidebarItem = ({ to, icon: Icon, label, collapsed }) => {
  return (
    <li className="relative group">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center p-2 rounded-md transition
          ${collapsed ? "justify-center" : "gap-3"}
          ${isActive ? "text-red-500" : "text-gray-500 hover:text-red-500"}`
        }
      >
        <Icon size={20} />
        {!collapsed && <span>{label}</span>}
      </NavLink>

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

      <ul className="space-y-4 text-sm md:text-[15px] font-extrabold text-gray-500">
        <SidebarItem
          to="/"
          icon={FiHome}
          label="Dashboard"
          collapsed={collapsed}
        />
        <SidebarItem
          to="/icon"
          icon={FiGrid}
          label="Icon"
          collapsed={collapsed}
        />

        <li className="relative group">
          <div
            onClick={() => setOpenMenu(!openMenu)}
            className={`flex items-center p-2 cursor-pointer hover:text-red-500
      ${collapsed ? "justify-center" : "justify-between"}
    `}
          >
            <div
              className={`flex items-center font-semibold ${collapsed ? "" : "gap-3"}`}
            >
              <FiMenu size={20} />
              {!collapsed && <span>Menu</span>}
            </div>

            {!collapsed && (
              <FiChevronDown
                className={`transition-transform ${
                  openMenu ? "rotate-180" : ""
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
              Menu
            </span>
          )}
          {!collapsed && openMenu && (
            <ul className="pl-10 mt-3 space-y-2 text-[14px] text-gray-400">
              <li
                className="
    relative pl-6 cursor-pointer
    transition-all duration-300
    before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2
    before:h-[3px] before:w-2 before:bg-gray-400
    before:transition-all before:duration-300
    hover:text-red-500
    hover:pl-8
    hover:before:w-5 hover:before:bg-red-500
  "
              >
                <Link to="/menus">Menus</Link>
              </li>

              <li
                className="relative pl-6 cursor-pointer
      transition-all duration-300
      before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2
      before:h-[3px] before:w-2 before:bg-gray-400
      before:transition-all before:duration-300
      hover:text-red-500
      hover:pl-8
      hover:before:w-5 hover:before:bg-red-500"
              >
                <Link to="/submenu">Submenu</Link>
              </li>

              <li
                className="relative pl-6 cursor-pointer
      transition-all duration-300
      before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2
      before:h-[3px] before:w-2 before:bg-gray-400
      before:transition-all before:duration-300
      hover:text-red-500
      hover:pl-8
      hover:before:w-5 hover:before:bg-red-500"
              >
                <Link to="/zone">Zone</Link>
              </li>
            </ul>
          )}
        </li>
        <SidebarItem
          to="/packages"
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
            <ul className="pl-10 mt-3 space-y-3 text-gray-400">
              <li
                className="
                relative pl-6 cursor-pointer
                transition-all duration-300
                before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2
                before:h-[3px] before:w-2 before:bg-gray-400
                before:transition-all before:duration-300
                hover:text-red-500
                hover:pl-8
                hover:before:w-5 hover:before:bg-red-500
              "
              >
                <Link to="/service/hotel" className="hover:text-red-500">
                  Hotel
                </Link>
              </li>
              <li
                className="
    relative pl-6 cursor-pointer
    transition-all duration-300
    before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2
    before:h-[3px] before:w-2 before:bg-gray-400
    before:transition-all before:duration-300
    hover:text-red-500
    hover:pl-8
    hover:before:w-5 hover:before:bg-red-500
  "
              >
                <Link to="/service/flight" className="hover:text-red-500">
                  Flight
                </Link>
              </li>
            </ul>
          )}
        </li>

        <SidebarItem
          to="/booking"
          icon={MdDateRange}
          label="Booking"
          collapsed={collapsed}
        />

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
      </ul>
    </div>
  );
};

export default Sidebar;
