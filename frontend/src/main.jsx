import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./redux/userSlice";
import loadingSlice from "./redux/loadingSlice.js";
import { ConfigProvider } from "antd";
import postSlice from "./redux/postSlice.js";
export const store = configureStore({
  reducer: {
    userSlice: userSlice,
    loadingSlice: loadingSlice,
    postSlice: postSlice,
  },
});

createRoot(document.getElementById("root")).render(
  <ConfigProvider
    notification={{
      top: 16,
      getContainer: () => document.body, // Đảm bảo nằm trực tiếp trong body
    }}
  >
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>
);
