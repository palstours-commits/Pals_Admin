import { combineReducers } from "redux";
import authReducer from "./slice/authSlice";
const reducer = combineReducers({
  auth: authReducer,
});
export default reducer;
