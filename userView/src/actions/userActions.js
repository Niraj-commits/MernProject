import axios from "axios";
import { message } from "antd";
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
} from "../constants/userConstants";

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });
    const config = {
      header: {
        "Content-type": "application/json",
      },
    };
    const { data } = await axios.post("http://localhost:8000/api/users/login", {
      email,
      password,
    });

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    localStorage.setItem("user", JSON.stringify(data));
    message.success("Login Successful");
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? message.error(error.response.data.message)
          : error.message,
    });
  }
};

export const register = (email, password, name) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });
    const config = {
      header: {
        "Content-type": "application/json",
      },
    };
    const { data } = await axios.post(
      "http://localhost:8000/api/users/register",
      {
        email,
        password,
        name,
      }
    );

    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    localStorage.setItem("user", JSON.stringify(data));
    message.success("Register Successful");
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? message.error(error.response.data.message)
          : error.message,
    });
  }
};
