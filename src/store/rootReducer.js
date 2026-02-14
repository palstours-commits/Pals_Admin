import { combineReducers } from "redux";
import loginReducer from "./slice/loginSlice";
const reducer = combineReducers({
  auth: loginReducer,
});
export default reducer;
