import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import ReduxThunk from "redux-thunk";

const initialState = {};
let store;

const AppReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "ACTION":
      return state;
    default:
      return state;
  }
};

store = createStore(
  combineReducers({
    app: AppReducer,
  }),
  composeWithDevTools(applyMiddleware(ReduxThunk))
);
console.log("Inside store");
console.log(store.getState());
export default store;
