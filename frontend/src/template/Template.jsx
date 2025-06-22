import React from "react";
import Navbar from "../components/Navbar/Navbar";

export default function Template({
  content,
  onNotificationPostClick,
  onSearch,
}) {
  // If content is a HomePage, clone and inject the prop
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
          marginLeft: "80px",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {contentWithProps}
      </div>
    </div>
  );
}
