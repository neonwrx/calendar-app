import {
  SET_EVENTS
} from '../actions/types';

const INITIAL_STATE = {};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_EVENTS:
      return {
        ...state, [action.payload.id]: action.payload.event
      };
    default:
      return state;
  }
}
