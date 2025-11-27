import { jwtDecode } from "jwt-decode";

export const decodeAccessToken = (accessToken) => {
  try {
    const decoded = jwtDecode(accessToken);
    return decoded;
  } catch (error) {
    console.error("Token không hợp lệ:", error);
    return null;
  }
};
