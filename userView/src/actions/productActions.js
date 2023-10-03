import axios from "axios";
import {
  PRODUCTS_LIST_FAIL,
  PRODUCTS_LIST_REQUEST,
  PRODUCTS_LIST_SUCCESS,
} from "../constants/productConstants";
import { message } from "antd";

// export const listProduct = () => async (dispatch, getState) => {
//   try {
//     dispatch({
//       type: PRODUCTS_LIST_REQUEST,
//     });

//     const {
//       userLogin: { user },
//     } = getState();

//     const { data } = await axios.get(`http://localhost:8000/api/products`);

//     dispatch({
//       type: PRODUCTS_LIST_SUCCESS,
//       payload: data,
//     });
//   } catch (error) {
//     error.response && error.response.data.message
//       ? console.log(error.response.data.message)
//       : error.message;
//     dispatch({
//       type: PRODUCTS_LIST_FAIL,
//       payload: message,
//     });
//   }
// };

export const listProduct = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCTS_LIST_REQUEST,
    });

    const {
      userLogin: { user },
    } = getState();

    const { data } = await axios.get(`http://localhost:8000/api/products`);

    dispatch({
      type: PRODUCTS_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    error.response && error.response.data.message
      ? message.error(error.response.data.message)
      : error.message;
    dispatch({
      type: PRODUCTS_LIST_FAIL,
      payload: message,
    });
  }
};
