import {
  FiMenu,
  FiSearch,
  FiBell,
  FiMail,
  FiMessageSquare,
} from "react-icons/fi";

const Header = ({ toggleSidebar, collapsed, toggleMobile }) => {
  return (
    <header className="w-full h-25 bg-white flex items-center justify-between  px-15">
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
      <div className="w-[300px] relative hidden md:block">
        <input
          type="text"
          placeholder="Search.."
          className="w-full py-3 pl-5 pr-12 rounded-xl bg-gray-100 outline-none border border-gray-200 text-xs"
        />
        <FiSearch
          size={20}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
        />
      </div>
      <div className="hidden md:flex items-center gap-8">
        <div className="relative">
          <FiMail size={24} className="text-green-900 cursor-pointer" />
          <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">
            76
          </span>
        </div>
        <div className="relative">
          <FiBell size={24} className="text-green-900 cursor-pointer" />
          <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">
            4
          </span>
        </div>
        <div className="relative">
          <FiMessageSquare
            size={24}
            className="text-green-900 cursor-pointer"
          />
          <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">
            15
          </span>
        </div>
        <img
          src="https://i.pravatar.cc/150?img=5"
          alt="profile"
          className="w-12 h-12 rounded-xl object-cover cursor-pointer"
        />
      </div>
    </header>
  );
};

export default Header;
