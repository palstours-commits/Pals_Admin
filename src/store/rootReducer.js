import { combineReducers } from "redux";
import authReducer from "./slice/authSlice";
import menuReducer from "./slice/menuSlice";
import submenuReducer from "./slice/submenuSlice";
import zoneReducer from "./slice/zoneSlice";
import packageReducer from "./slice/packageSlice";
const reducer = combineReducers({
  auth: authReducer,
  menu: menuReducer,
  submenu: submenuReducer,
  zone: zoneReducer,
  package: packageReducer,
});
export default reducer;
