import { combineReducers } from "redux";
import authReducer from "./slice/authSlice";
import menuReducer from "./slice/menuSlice";
import submenuReducer from "./slice/submenuSlice";
import zoneReducer from "./slice/zoneSlice";
const reducer = combineReducers({
  auth: authReducer,
  menu: menuReducer,
  submenu: submenuReducer,
  zone: zoneReducer,
});
export default reducer;
