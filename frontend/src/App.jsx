import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import LoginForm from "./Pages/Login&Register/LoginForm";
import { Toaster } from "react-hot-toast";
import RegisterForm from "./Pages/Login&Register/RegisterForm";
import Loading from "./components/Loading/Loading";
import Template from "./template/Template";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage";
import PostForm from "./Pages/user/PostForm/PostForm";
import ProfileUser from "./components/UserProfile/UserProfile";
import SavedPostsPage from "./Pages/user/SavedPostsPage/SavedPostsPage";
import React, { useRef } from "react";
import Notification from "./components/Notification/Notification";
import SearchPage from "./Pages/user/SearchPage/SearchPage";
import "@ant-design/v5-patch-for-react-19";
import Message from "./Pages/Message/message";
function App() {
  const homePageRef = useRef();

  const handleSearch = (query) => {
    if (homePageRef.current && homePageRef.current.handleSearch) {
      homePageRef.current.handleSearch(query);
    }
  };

  // Handler to open post detail from notification
  const handleNotificationPostClick = (post_id) => {
    if (homePageRef.current && homePageRef.current.openPostDetailById) {
      homePageRef.current.openPostDetailById(post_id);
    }
  };

  return (
    <div>
      <Loading />
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route
            path="/"
            element={
              <Template
                content={<HomePage ref={homePageRef} />}
                onNotificationPostClick={handleNotificationPostClick}
                onSearch={handleSearch}
              />
            }
          />
          <Route
            path="/create-post"
            element={<Template content={<PostForm />} />}
          />
          <Route
            path="/profile"
            element={<Template content={<ProfileUser />} />}
          />
          <Route
            path="/saved-posts"
            element={<Template content={<SavedPostsPage />} />}
          />
          <Route
            path="/search"
            element={<Template content={<SearchPage />} />}
          />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/notic" element={<Notification />} />
          <Route path="/message" element={<Message></Message>} />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
