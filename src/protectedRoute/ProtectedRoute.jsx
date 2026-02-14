import { Navigate, Outlet } from "react-router-dom";
import Header from "../component/Common/Header/Header";
import Sidebar from "../component/Common/Sidebar/Sidebar";
import { useState } from "react";
import { useSelector } from "react-redux";

const ProtectedLayout = () => {
  const { accessToken, loading } = useSelector((state) => state.auth);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`
          fixed md:static z-50 top-0 left-0 h-full bg-white
          transition-all duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${collapsed ? "md:w-16" : "md:w-64"}
          w-64
        `}
      >
        <Sidebar collapsed={collapsed} />
      </div>

      <div className="flex-1 flex flex-col w-full">
        <Header
          collapsed={collapsed}
          toggleSidebar={() => setCollapsed(!collapsed)}
          toggleMobile={() => setMobileOpen(!mobileOpen)}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
