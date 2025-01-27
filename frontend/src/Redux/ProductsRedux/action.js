import * as types from "./actionTypes";
import axios from "axios";
const backend_url= process.env.REACT_APP_MAIN_URL

const getProducts = (id) => (dispatch) => {
  dispatch({ type: types.GET_PRODUCTS_REQUEST });
  const url = backend_url+'/fooditems/get/' + id + '?format=json';
  // console.log("changed id", id)
  return axios
    .get(url)
    .then((r) => {
      return dispatch({
        type: types.GET_PRODUCTS_SUCCESS,
        payload: r.data,
      });
    })
    .catch((e) => {
      return dispatch({ type: types.GET_PRODUCTS_FAILURE, payload: e });
    });
};

const getAllProducts = () => (dispatch) => {
  dispatch({ type: types.GET_ALL_PRODUCTS_REQUEST });
  const url = backend_url+'/fooditems/get?format=json';
  return axios
    .get(url)
    .then((r) => {
      return dispatch({
        type: types.GET_ALL_PRODUCTS_SUCCESS,
        payload: r.data,
      });
    })
    .catch((e) => {
      return dispatch({ type: types.GET_ALL_PRODUCTS_FAILURE, payload: e });
    });
};

export { getProducts, getAllProducts };

