import user from './user_reducer';
import { combineReducers } from 'redux';
// combineReducers는 여러가지 reducer를 합쳐주어 하나로 만들어준다!!


const rootReducer = combineReducers({
    user
})

export default rootReducer;