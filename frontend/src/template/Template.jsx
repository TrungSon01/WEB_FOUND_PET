import React from "react";
import Navbar from "../components/Navbar/Navbar";
import { useLocation } from "react-router-dom";

export default function Template({
  content,
  onNotificationPostClick,
  onSearch,
}) {
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";

  const contentWithProps =
    React.isValidElement(content) && content.type.name === "HomePage"
      ? React.cloneElement(content, { onNotificationPostClick })
      : content;

  return (
    <div>
      <Navbar
        onNotificationPostClick={onNotificationPostClick}
        onSearch={onSearch}
      />
      <div
        style={{
          marginLeft: isSearchPage ? "0" : "80px",
          height: "100vh",
        }}
        className={isSearchPage ? "lg:ml-0" : "lg:ml-20"}
      >
        {contentWithProps}
      </div>
    </div>
  );
}
