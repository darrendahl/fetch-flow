import { combineReducers } from "redux";
import { loadingReducer } from "redux-fetch-flow";

const initialState = {
  invoices: [],
  todos: []
}

const appReducer = (state = initialState, action) => {
  switch(action.type){
    case "TODOS_SUCCESS":
      const { todos } = action.payload
      return {
        ...state,
        todos
      }
    case "INVOICES_SUCCESS":
      const { invoices } = action.payload
      return {
        ...state,
        invoices
      }
    default: 
      return state
  }
}


const rootReducer = combineReducers({
  //...other reducers
  app: appReducer,
  loading: loadingReducer
});

export default rootReducer;
