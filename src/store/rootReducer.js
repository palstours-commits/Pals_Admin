import { combineReducers } from "redux";
import productReducer from "./slice/product";
const reducer = combineReducers({
  product: productReducer,
});
export default reducer;
