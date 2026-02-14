import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Login/Login";
import ProtectedLayout from "./protectedRoute/ProtectedRoute";
import Menu from "./pages/Menu/Menu";
import SubMenu from "./pages/SubMenu/SubMenu";
import Zone from "./pages/Zone/Zone";
import Contact from "./pages/Contact/Contact";
import Flight from "./pages/Flight/Flight";

function App() {
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
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
