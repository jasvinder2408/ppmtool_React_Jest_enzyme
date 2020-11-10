import { GET_SERVICES, GET_SERVICE_BY_ID } from "../actions/types";

const initialState = {
  services: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_SERVICES: {
      return {
        ...state,
        services: action.payload,
      };
    }
    case GET_SERVICE_BY_ID:
      return {
        ...state,
        service: action.payload,
      };
    default:
      return state;
  }
}
