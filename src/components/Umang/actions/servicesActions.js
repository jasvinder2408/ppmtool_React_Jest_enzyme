import axios from "axios";
import { GET_SERVICES, GET_ERRORS, GET_SERVICE_BY_ID } from "./types";

export const createService = (service, history) => async (dispatch) => {
  try {
    await axios.post("/api/service", service);
    history.push("/services");
    dispatch({
      type: GET_ERRORS,
      payload: {},
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data,
    });
  }
};

export const getAllServices = () => async (dispatch) => {
  const res = await axios.get("/api/service/all");

  dispatch({
    type: GET_SERVICES,
    payload: res.data,
  });
};

export const getServiceById = (id, history) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/service/${id}`);
    dispatch({
      type: GET_SERVICE_BY_ID,
      payload: res.data,
    });
  } catch (error) {
    history.push("/services");
  }
};
