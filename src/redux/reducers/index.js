import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import questionsReducer from './gameReducer';

const rootReducer = combineReducers({ loginReducer, questionsReducer });

export default rootReducer;
