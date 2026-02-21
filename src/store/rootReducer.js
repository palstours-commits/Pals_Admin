import { combineReducers } from "redux";
import authReducer from "./slice/authSlice";
import menuReducer from "./slice/menuSlice";
import submenuReducer from "./slice/submenuSlice";
import zoneReducer from "./slice/zoneSlice";
import packageReducer from "./slice/packageSlice";
import enquiryReducer from "./slice/enquirySlice";
import contactusReducer from "./slice/contactusSlice";
import iconReducer from "./slice/iconSlice";
import bookingReducer from "./slice/bookingSlice";
import dashboardReducer from "./slice/dashboardSlice";
import offerReducer from "./slice/offerSlice";
import flightReducer from "./slice/flightSlice";
import blogReducer from "./slice/blogSlice";
import careerReducer from "./slice/careerSlice";
import hotelReducer from "./slice/HotelSlice";
import visaReducer from "./slice/visasSlice";
import transportReducer from "./slice/transportSlice";
import reportReducer from "./slice/reportSlice";
const reducer = combineReducers({
  auth: authReducer,
  menu: menuReducer,
  submenu: submenuReducer,
  zone: zoneReducer,
  package: packageReducer,
  enquiry: enquiryReducer,
  contactus: contactusReducer,
  icon: iconReducer,
  booking: bookingReducer,
  dashboard: dashboardReducer,
  offer: offerReducer,
  adminFlight: flightReducer,
  blog: blogReducer,
  career: careerReducer,
  hotels: hotelReducer,
  visas: visaReducer,
  transports: transportReducer,
  report: reportReducer,
});
export default reducer;
