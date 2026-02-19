import {
  FiMenu,
  FiSearch,
  FiBell,
  FiMail,
  FiMessageSquare,
  FiUser,
  FiMail as FiInbox,
  FiLogOut,
} from "react-icons/fi";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/slice/authSlice";
import { notifyAlert } from "../../../utils/notificationService";
import { Link } from "react-router-dom";

const Header = ({ toggleSidebar, toggleMobile }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    notifyAlert({
      title: "Logout Success",
      message: "Logout Succesfully",
      type: "success",
    });
  };

  return (
    <header className="w-full h-25 bg-white flex items-center justify-between px-15 relative">
      <div className="flex items-center gap-4">
        <FiMenu
          size={24}
          className="cursor-pointer md:hidden"
          onClick={toggleMobile}
        />
        <FiMenu
          size={24}
          className="cursor-pointer hidden md:block"
          onClick={toggleSidebar}
        />
        <h1 className="text-lg md:text-2xl font-semibold">Dashboard</h1>
      </div>
      <div className="hidden md:flex items-center gap-8">
        <div className="relative">
          <FiBell size={24} className="text-green-900 cursor-pointer" />
          <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">
            4
          </span>
        </div>
        <div
          className="relative"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <img
            src="https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2558760599.jpg"
            alt="profile"
            className="w-12 h-12 rounded-xl object-cover cursor-pointer"
          />
          {open && (
            <div className="absolute right-0 pt-4 w-48 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-50">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                <FiUser className="text-red-500" />
                <Link to="/profile" className="text-gray-700">Profile</Link>
              </div>
              <div
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <FiLogOut className="text-red-500" />
                <span className="text-gray-700">Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
