import React from "react";
import { useSelector } from "react-redux";
import { HashLoader } from "react-spinners";

export default function Loading() {
  let { isLoading } = useSelector((state) => state.loadingSlice);
  console.log(" isLoading:", isLoading);

  if (!isLoading) {
    return <></>;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <HashLoader color="#FFA725" size={60} speedMultiplier={2} />
    </div>
  );
}
