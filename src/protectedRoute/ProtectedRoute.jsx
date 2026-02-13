import { Outlet } from "react-router-dom";
import Header from "../component/Common/Header/Header";
import Sidebar from "../component/Common/Sidebar/Sidebar";

const ProtectedLayout = () => {
  return (
    <div className="h-screen flex overflow-hidden">
      <div className="flex flex-1">
        <div className="w-16 md:w-70 h-full sticky top-0 bg-white">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
