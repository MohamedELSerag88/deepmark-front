import { createStore, applyMiddleware, compose } from "redux"
 
import rootReducer from "./reducers"
 import thunk from 'redux-thunk'

 const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const middleWares = [thunk]

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleWares))
)
 
export default store
