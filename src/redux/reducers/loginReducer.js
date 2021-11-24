import { SET_USER } from '../actions/loginAction';

const INITIAL_STATE = {
  playerName: '',
  layerEmail: '',
};

export default function loginReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
  case SET_USER:
    return {
      ...state,
      playerName: action.payload.name,
      playerEmail: action.payload.email,
    };
  default:
    return state;
  }
}
