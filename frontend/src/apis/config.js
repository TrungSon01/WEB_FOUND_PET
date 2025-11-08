import axios from "axios";
import { store } from "../main";
import { hideLoading, showLoading } from "../redux/loadingSlice";
// axios interceptor

export const https = axios.create({
  baseURL: "http://localhost:8000",
});

// Add a request interceptor
https.interceptors.request.use(
  function (config) {
    console.log("Api đi");
    store.dispatch(showLoading());
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
https.interceptors.response.use(
  function (response) {
    console.log("Api về thành công");
    store.dispatch(hideLoading());
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    console.log("Api về lỗi");
    store.dispatch(hideLoading());
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
