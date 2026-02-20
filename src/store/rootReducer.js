import { combineReducers } from "redux";
import authReducer from "./slice/authSlice";
import menuReducer from "./slice/menuSlice";
import submenuReducer from "./slice/submenuSlice";
import zoneReducer from "./slice/zoneSlice";
import packageReducer from "./slice/packageSlice";
import enquiryReducer from "./slice/enquirySlice";
import contactusReducer from "./slice/contactusSlice";
import IconReducer from "./slice/iconSlice";
import bookingReducer from "./slice/bookingSlice";
import dashboardReducer from "./slice/dashboardSlice";
import offerReducer from "./slice/offerSlice";
import adminFlightReducer from "./slice/adminFlightSlice";
import blogReducer from "./slice/blogSlice";
const reducer = combineReducers({
  auth: authReducer,
  menu: menuReducer,
  submenu: submenuReducer,
  zone: zoneReducer,
  package: packageReducer,
  enquiry: enquiryReducer,
  contactus: contactusReducer,
  icon: IconReducer,
  booking: bookingReducer,
  dashboard: dashboardReducer,
  offer: offerReducer,
  adminFlight: adminFlightReducer,
  blog: blogReducer,
});
export default reducer;
