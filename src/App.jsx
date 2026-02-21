import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  clearTokenRefresh,
  setupTokenRefresh,
} from "./utils/setupTokenRefresh";
import { useEffect } from "react";
import HomePage from "./pages/Home/HomePage";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Login/Login";
import ProtectedLayout from "./protectedRoute/ProtectedRoute";
import Menu from "./pages/Menu/Menu";
import SubMenu from "./pages/SubMenu/SubMenu";
import Zone from "./pages/Zone/Zone";
import Contact from "./pages/Contact/Contact";
import Flight from "./pages/Flight/Flight";
import Package from "./pages/Package/Package";
import ViewPackage from "./pages/ViewPackage/ViewPackage";
import Enquiry from "./pages/Enquiry/Enquiry";
import IconPage from "./pages/Icon/Icon";
import Booking from "./pages/Booking/Booking";
import Profile from "./pages/Profile/Profile";
import Offers from "./pages/Offers/Offers";
import Blog from "./pages/Blog/Blog";
import Career from "./pages/Career/Career";

function App() {
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    if (accessToken) {
      setupTokenRefresh();
    } else {
      clearTokenRefresh();
    }
    return () => {
      clearTokenRefresh();
    };
  }, [accessToken]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/menus" element={<Menu />} />
        <Route path="/submenu" element={<SubMenu />} />
        <Route path="/zone" element={<Zone />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/service/flight" element={<Flight />} />
        <Route path="/packages" element={<Package />} />
        <Route path="/enquiry" element={<Enquiry />} />
        <Route path="/icon" element={<IconPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/career" element={<Career />} />
        <Route path="/package/:id" element={<ViewPackage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/booking" element={<Booking />} />
      </Route>
    </Routes>
  );
}

export default App;
