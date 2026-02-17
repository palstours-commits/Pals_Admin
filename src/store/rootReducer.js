import { combineReducers } from "redux";
import authReducer from "./slice/authSlice";
import menuReducer from "./slice/menuSlice";
import submenuReducer from "./slice/submenuSlice";
import zoneReducer from "./slice/zoneSlice";
import packageReducer from "./slice/packageSlice";
import enquiryReducer from "./slice/enquirySlice";
import contactusReducer from "./slice/contactusSlice";
import IconReducer from "./slice/iconSlice";
const reducer = combineReducers({
  auth: authReducer,
  menu: menuReducer,
  submenu: submenuReducer,
  zone: zoneReducer,
  package: packageReducer,
  enquiry: enquiryReducer,
  contactus: contactusReducer,
  icon: IconReducer,
});
export default reducer;
